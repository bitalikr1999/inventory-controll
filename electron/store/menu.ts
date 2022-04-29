import { ipcMain } from 'electron'
import { dbCwd } from 'electron/config'
import _ from 'lodash'
const Store = require('electron-store')

const store = new Store({
	name: 'menus',
	cwd: dbCwd,
})

const getMenus = async (_date: string | number): Promise<any[]> => {
	const key = getKey(_date)
	const items = await store.get(key)
	return items ? items : []
}

const getKey = (_date: string | number) => {
	const date = new Date(_date)
	return `${date.getFullYear()}_${date.getMonth()}`
}

const getId = (payload: AddMenuPayload) => {
	if (payload.id) return payload.id
	return new Date(payload.date).getTime()
}

export const initMenusStoreListeners = () => {
	ipcMain.handle('getMenus', (_, date: string) => {
		return getMenus(date)
	})

	ipcMain.handle('getMenu', async (_, id: string) => {
		const menus = await getMenus(id)

		const menu = menus.find(it => String(it.id) === String(id))
		return menu
	})

	ipcMain.handle('removeMenu', async (_, id: string) => {
		const menus = await getMenus(id)
		const key = getKey(id)

		await store.set(
			key,
			menus.filter(it => it.id !== id),
		)
	})

	// ipcMain.handle('getMenu', async (_, id: number) => {
	// 	const groups = await getGroups()
	// 	return groups.find((it: any) => Number(it.id) === Number(id))
	// })

	ipcMain.handle('addMenu', async (_, payload: AddMenuPayload) => {
		const id = getId(payload)
		const key = getKey(id)
		const menus = await getMenus(id)

		const newMenu = {
			id,
			name: payload.name,
			date: payload.date,
			items: payload.items,
			groupCategory: payload.groupCategory,
		}

		const menuExistIndex = menus.findIndex(
			it => String(it.id) === String(id),
		)

		if (menuExistIndex >= 0) menus[menuExistIndex] = newMenu
		else menus.push(newMenu)

		await store.set(key, menus)
		return newMenu
	})
}

interface AddMenuPayload {
	id?: number
	name: string
	date: string
	groupCategory: string
	items: {
		name: string
		products: {
			productId: number
			count: number
		}[]
	}[]
}
