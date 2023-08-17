import {
	GenerateZdoDataXlsx,
	GenerateZdoXlsx,
	GenerateZdosXlsxParams,
	IMenuItemProduct,
	ZdoItem,
} from 'electron/typing'
import { MenuReport } from '../menu/menu-report'
import { GroupCategoryKey } from '@/@types/enums'
import moment from 'moment'
import { getFromStore } from 'electron/store'
import { ProductsSummaryXlsxGenerator } from 'electron/xlsx/products-summary'
const util = require('util')

export class ProductsSummaryXlsx {
	private data: Partial<GenerateZdoDataXlsx> = {
		items: [],
	}
	private params: GenerateZdosXlsxParams
	private date: Date
	private menuReport: MenuReport
	private daysInMonthCount: number

	public async generate(params: GenerateZdosXlsxParams) {
		this.params = params
		this.date = this.getDateobject()
		this.menuReport = new MenuReport()
		this.initDaysCount()

		await this.menuReport.init(this.date)
		await this.calcByCategories()
		await this.loadSettings()

		new ProductsSummaryXlsxGenerator().generate(this.data as any)
	}

	private initDaysCount() {
		this.daysInMonthCount = moment(this.date).daysInMonth()
	}

	private getDateobject() {
		const year = this.params.date.split('/')[0]
		const month = this.params.date.split('/')[1]
		const date = new Date()
		date.setFullYear(Number(year))
		date.setMonth(Number(month))
		return date
	}

	private async loadSettings() {
		const settings: any[] = await getFromStore('settings', 'list')
		const settingsObj: Record<string, string> = {}

		settings.map(it => (settingsObj[it.key] = it.value))

		this.data.name = settingsObj?.name
		this.data.edrpoy = settingsObj?.edrpoy
		this.data.daysInMonthCount = this.daysInMonthCount
		this.data.director = settingsObj?.director
		this.data.date = this.date
	}

	private async calcByCategories() {
		const keys = Object.values(GroupCategoryKey)

		this.data.items = []

		for await (const key of keys) {
			try {
				const item = await this.calcCategory(key as any)
				this.data.items.push(item)
			} catch (e) {
				console.log(e)
			}
		}
	}

	private async calcCategory(categoryKey: GroupCategoryKey) {
		const result: GenerateZdoXlsx = {
			items: [],
			title: '',
			subtitle: '',
			date: this.date.toDateString(),
			numberOfRecipients: 0,
			numberOfRecipientsByDays: {},
			category: categoryKey,
		}

		const menus = this.menuReport.getMenusByCategory(categoryKey)
		const menusWarehouseItems: Array<TempWarehouseItem> = []

		menus.map(menu => {
			menu.items.map(item => {
				item.products.map(menuProduct => {
					const warehouseId = menuProduct.product.warehouseId

					const index = menusWarehouseItems.findIndex(
						it =>
							String(it.origin.warehouseId) ===
							String(warehouseId),
					)
					if (index === -1) {
						const warehouseItem = {
							warehouseId: warehouseId,
							price: menuProduct.product.price,
							name: menuProduct.product.name,
							measurmentUnit: menuProduct.product.measurmentUnit,
						}

						menusWarehouseItems.push({
							origin: warehouseItem,
							items: [{ ...menuProduct, date: menu.date }],
						})
					} else {
						menusWarehouseItems[index].items.push({
							...menuProduct,
							date: menu.date,
						})
					}
				})
			})
		})
		// console.log(
		// 	util.inspect(
		// 		menusWarehouseItems,
		// 		false,
		// 		null,
		// 		true /* enable colors */,
		// 	),
		// )

		const items: ZdoItem[] = []

		await Promise.all(
			menusWarehouseItems.map(async it => {
				const toAdd = await this.calcByWarehouseItem(it)
				if (toAdd) items.push(toAdd)
			}),
		)

		result.items = items

		return result
	}

	private async calcByWarehouseItem(item: TempWarehouseItem) {
		try {
			const result: ZdoItem = {
				price: item.origin.price,
				name: item.origin.name,
				measurmentUnit: item.origin.measurmentUnit,
				byDays: [],
				totalCount: 0,
				totalPrice: 0,
			}
			const obj: Record<string, IMenuItemProduct[]> = {}

			item.items.map(it => {
				const key = moment(new Date(it.date)).format('D')
				if (obj[key]) obj[key].push(it)
				else obj[key] = [it]
			})

			for (let day = 1; day <= this.daysInMonthCount; day++) {
				const items = obj[day]
				const toAdd = {
					count: 0,
					summ: 0,
					date: day,
				}

				if (items) {
					items.map(it => {
						toAdd.count += Number(it.count)
					})

					toAdd.summ = Number(result.price) * toAdd.count
				}

				result.byDays.push(toAdd)
				result.totalCount += Number(toAdd.count)
				result.totalPrice += Number(toAdd.summ)
			}

			return result
		} catch (e) {
			console.log(e)
			return null
		}
	}
}
setTimeout(() => {
	new ProductsSummaryXlsx().generate({ date: '2023/7' })
}, 3000)

interface TempWarehouseItem {
	origin: {
		warehouseId: string
		price: number
		name: string
		measurmentUnit: string
	}
	items: Array<IMenuItemProduct & { date: string }>
}
