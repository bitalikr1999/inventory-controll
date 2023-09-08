import {
	GenerateZdoDataXlsx,
	GenerateZdoXlsx,
	GenerateZdosXlsxParams,
	IMenu,
	IMenuItemProduct,
	ZdoItem,
} from 'electron/typing'
import { MenuReport } from '../menu/menu-report'
import { GroupCategoryKey } from '@/@types/enums'
import moment from 'moment'
import { ProductsSummaryXlsxGenerator } from 'electron/xlsx/products-summary'
import { YMstringToDate } from 'electron/helpers/date'
import { settingsRepository } from 'electron/repositories'

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
		return YMstringToDate(this.params.date)
	}

	private async loadSettings() {
		const settings: any[] = await settingsRepository.find({})
		const settingsObj: Record<string, string> = {}

		settings.map(it => (settingsObj[it.key] = it.value))

		this.data.name = settingsObj?.name
		this.data.edrpoy = settingsObj?.edrpoy
		this.data.daysInMonthCount = this.daysInMonthCount
		this.data.director = settingsObj?.director
		this.data.date = this.date
		this.data.storekeeper = settingsObj?.storekeeper
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

		const item = await this.calcCategory()
		this.data.items.push(item)
	}

	private async calcCategory(categoryKey?: GroupCategoryKey) {
		const result: GenerateZdoXlsx = {
			items: [],
			title: '',
			subtitle: '',
			date: this.date.toDateString(),
			numberOfRecipients: 0,
			numberOfRecipientsByDays: {},
			category: categoryKey,
			totalBruto: 0,
			totalFree: 0,
			totalNetto: 0,
			menusCount: 0,
		}

		const menus = this.menuReport.getMenusByCategory(categoryKey)
		const menusWarehouseItems: Array<TempWarehouseItem> = []
		const countRecepients = await this.calcNumberOfRecepients(menus)

		result.menusCount = Number(menus.length)
		result.numberOfRecipients = countRecepients.total
		result.numberOfRecipientsByDays = countRecepients.byDays

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

		const items: ZdoItem[] = []

		await Promise.all(
			menusWarehouseItems.map(async it => {
				const toAdd = await this.calcByWarehouseItem(it)
				if (toAdd) items.push(toAdd)
			}),
		)

		result.items = items
		result.items.map(it => {
			result.totalBruto += Number(it.totalPrice)
			result.totalFree += Number(it.totalFree)
		})
		result.totalNetto = result.totalBruto - result.totalFree

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
				totalFree: 0,
				totalNetto: 0,
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
					freeCount: 0,
					freeSumm: 0,
				}

				if (items) {
					items.map(it => {
						toAdd.count += Number(it.count)
						if (it.isFree) toAdd.freeCount += Number(it.count)
					})

					toAdd.summ = Number(result.price) * toAdd.count
					toAdd.freeSumm = Number(result.price) * toAdd.freeCount
				}

				result.byDays.push(toAdd)
				result.totalCount += Number(toAdd.count)
				result.totalPrice += Number(toAdd.summ)
				result.totalFree += Number(toAdd.freeSumm)
			}

			result.totalNetto =
				Number(result.totalPrice) - Number(result.totalFree)

			return result
		} catch (e) {
			console.log(e)
			return null
		}
	}

	protected async calcNumberOfRecepients(menus: IMenu[]) {
		const result: any = {
			total: 0,
			byDays: {},
		}

		await Promise.all(
			menus.map(async it => {
				const childrensCount =
					await this.menuReport.getMenuChildrensCount(it._id)

				result.total += Number(childrensCount)
				const dayKey = new Date(it.date).getDate()

				if (result.byDays[dayKey])
					result.byDays[dayKey] += Number(childrensCount)
				else result.byDays[dayKey] = Number(childrensCount)
			}),
		)

		return result
	}
}

interface TempWarehouseItem {
	origin: {
		warehouseId: string
		price: number
		name: string
		measurmentUnit: string
	}
	items: Array<IMenuItemProduct & { date: string }>
}
