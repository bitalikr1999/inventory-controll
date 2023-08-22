import { GroupCategoryKey } from '@/@types/enums'
import { IMenu } from 'electron/typing'
import { ChildrenCounter } from '../childrens/children-counter'
import { YMstringToDate, dateToYMstring } from 'electron/helpers/date'
import { menusRepository } from 'electron/repositories'

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
	private clearMenus: IMenu[] = []
	private menusObj: Record<string, IPreparedMenu> = {}
	private childrenCounter: ChildrenCounter

	public async init(date: Date) {
		this.date = date
		await this.initChildrenCount()
		await this.loadMenus()

		return this
	}

	private async initChildrenCount() {
		this.childrenCounter = new ChildrenCounter().setParams({
			date: dateToYMstring(this.date),
		})

		await this.childrenCounter.preload()
	}

	public async setDate(yearMonthString: string) {
		this.date = YMstringToDate(yearMonthString)
	}

	public getMenu(params: IGetOneChildSummParams) {
		const key = this.generateMenuObjKey(params.groupCategoryKey, params.day)
		const existMenu = this.menusObj[key]
		return existMenu
	}

	private async loadMenus() {
		const menus = await this.menuRepository.findByDate(this.date as any)
		const result: IPreparedMenu[] = menus.map(this.prepareMenu.bind(this))
		this.clearMenus = menus
		this.menus = result
		this.menusObj = {}

		result.map(item => {
			this.menusObj[this.generateMenuObjKeyFromPreparedMenu(item)] = item
		})
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

		menu.childrensCount = this.childrenCounter.getCountByCategory(
			new Date(menu.date).getDate(),
			menu.groupCategory as any,
		)

		const nettoSumm = summ - freeSumm

		return {
			menu,
			summ,
			freeSumm,
			nettoSumm,
			oneChildSumm: nettoSumm / menu.childrensCount,
		}
	}

	public getMenusByCategory(category?: GroupCategoryKey) {
		if (!category) return this.clearMenus
		return this.clearMenus.filter(it => it.groupCategory === category)
	}

	public async getMenuChildrensCount(menuId: string) {
		const menu = await this.menuRepository.findOne(menuId)
		if (!menu) return 0

		return this.childrenCounter.getCountByCategory(
			new Date(menu.date).getDate(),
			menu.groupCategory as any,
		)
	}

	public getPreparedMenus() {
		return Object.values(this.menusObj)
	}
}
