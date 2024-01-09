import { Controller } from 'electron/abstract'
import { getMenuDifference, getMenuKey } from 'electron/helpers'
import { menusRepository, warehouseRepository } from 'electron/repositories'
import { AddMenuPayload, GetMenusParams, IMenu } from 'electron/typing'
import { generateMenusXlsx } from 'electron/xlsx/menu'

export class MenusController extends Controller {
	protected basePath = 'menus'
	protected routes = {
		getMany: this.handleGetMany,
		getOne: this.handleGetOne,
		remove: this.handleRemove,
		put: this.handlePut,
		generateXlsx: this.handleGenerateMenusXlsx,
	}

	protected handleGetMany(_: unknown, params: GetMenusParams) {
		return menusRepository.findByDate(params.date)
	}

	protected handleGetOne(_: unknown, _id: string) {
		return menusRepository.findOne(_id)
	}

	protected handleRemove(_: unknown, _id: string) {
		return menusRepository.remove(_id)
	}

	protected async handlePut(_: unknown, payload: AddMenuPayload) {
		const data: any = {
			name: payload.name,
			date: payload.date,
			dateGroupKey: getMenuKey(payload.date),
			childrensCount: payload.childrensCount,
			items: payload.items,
			groupCategory: payload.groupCategory,
		}

		const existMenu: IMenu = payload.id
			? await menusRepository.findOne(payload.id)
			: null

		const difference = getMenuDifference(existMenu, data)
		console.log('difference', difference)
		await saveDifferenceMenu(difference)

		let resultId: string = payload.id

		if (existMenu) {
			await menusRepository.updateOne({ _id: payload.id }, data)
		} else {
			const menu = await menusRepository.insert(data)
			resultId = menu._id
		}

		return menusRepository.findOne(resultId)
	}

	protected async handleGenerateMenusXlsx(_: unknown, data: any) {
		return generateMenusXlsx(data)
	}
}

const saveDifferenceMenu = async (difference: {
	warehouseToReturn: any[]
	warehouseToSubstract: any[]
}) => {
	try {
		for await (const item of difference.warehouseToSubstract) {
			if (item.count && item.count > 0)
				await warehouseRepository.decreaseWarehouseItemCount(
					item.warehouseId,
					item.count,
				)
		}
	} catch (e) {
		console.log('e', e)
	}

	for await (const item of difference.warehouseToReturn) {
		if (item.count && item.count > 0)
			await warehouseRepository.increaseWarehouseItemCount(
				item.warehouseId,
				item.count,
			)
	}
}
