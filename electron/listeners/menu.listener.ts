import { ipcMain } from 'electron'
import { getMenuDifference, getMenuKey } from 'electron/helpers'
import { menusRepository } from 'electron/store/menu'
import {
	decreaseWarehouseItemCount,
	increaseWarehouseItemCount,
} from 'electron/store/warehouse'
import { AddMenuPayload, GetMenusParams, IMenu } from 'electron/typing'

const saveDifferenceMenu = async (difference: {
	warehouseToReturn: any[]
	warehouseToSubstract: any[]
}) => {
	for await (const item of difference.warehouseToSubstract) {
		await decreaseWarehouseItemCount(item.warehouseId, item.count)
	}

	for await (const item of difference.warehouseToReturn) {
		await increaseWarehouseItemCount(item.warehouseId, item.count)
	}
}

export const initMenusStoreListeners = () => {
	ipcMain.handle('getMenus', (_, { date }: GetMenusParams) => {
		return menusRepository.findByDate(date)
	})

	ipcMain.handle('getMenu', async (_, _id: string) => {
		return menusRepository.findOne(_id)
	})

	ipcMain.handle('removeMenu', async (_, _id: string) => {
		return menusRepository.remove(_id)
	})

	ipcMain.handle('saveMenu', async (_, payload: AddMenuPayload) => {
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
		await saveDifferenceMenu(difference)

		let resultId: string = payload.id

		if (existMenu) {
			await menusRepository.updateOne({ _id: payload.id }, { $set: data })
		} else {
			const menu = await menusRepository.insert(data)
			resultId = menu._id
		}

		return menusRepository.findOne(resultId)
	})
}
