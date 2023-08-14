import { GroupCategoryKey } from '@/@types/enums'
import { calcDishPrice } from 'electron/helpers'
import { menusRepository } from 'electron/store/menu'
import { IMenu } from 'electron/typing'

interface IPreparedMenu {
	menu: IMenu
	summ: number
	freeSumm: number
	nettoSumm: number
	oneChildSumm: number
}

interface IGetOneChildSummParams {
	groupCategoryKey: GroupCategoryKey
	day: number
}

export class MenuReport {
	private date: Date = new Date()
	private menuRepository = menusRepository
	private menus: IPreparedMenu[] = []
	private menusObj: Record<string, IPreparedMenu> = {}

	public async init() {
		await this.loadMenus()
		return this
	}

	public async setDate(yearMonthString: string) {
		const year = yearMonthString.split('/')[0]
		const month = yearMonthString.split('/')[1]
		const date = new Date()
		date.setFullYear(Number(year))
		date.setMonth(Number(month))
		this.date = date
	}

	public getMenu(params: IGetOneChildSummParams) {
		const key = this.generateMenuObjKey(params.groupCategoryKey, params.day)
		const existMenu = this.menusObj[key]
		return existMenu
	}

	private async loadMenus() {
		const menus = await this.menuRepository.findByDate(this.date as any)
		const result: IPreparedMenu[] = menus.map(this.prepareMenu)
		console.log('Load menus result', result)
		this.menus = result
		this.menusObj = {}

		result.map(item => {
			this.menusObj[this.generateMenuObjKeyFromPreparedMenu(item)] = item
		})
		console.log(this.menusObj)
	}

	private generateMenuObjKeyFromPreparedMenu(preparedMenu: IPreparedMenu) {
		const date = new Date(preparedMenu.menu.date)
		return this.generateMenuObjKey(
			preparedMenu.menu.groupCategory,
			date.getDate(),
		)
	}

	private generateMenuObjKey(category: string, day: number) {
		return `${category}/${day}`
	}

	private prepareMenu(menu: IMenu): IPreparedMenu {
		let summ = 0
		let freeSumm = 0

		menu.items.map(menuItem => {
			let brutto = 0
			let free = 0

			menuItem.products.map(it => {
				const summ = Number(it.product.price) * Number(it.count)
				brutto += summ
				if (it.isFree) free += summ
			})

			summ += brutto
			freeSumm += free
		})

		const nettoSumm = summ - freeSumm
		return {
			menu,
			summ,
			freeSumm,
			nettoSumm,
			oneChildSumm: nettoSumm / menu.childrensCount,
		}
	}
}
