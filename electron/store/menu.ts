import { da } from 'date-fns/locale'
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
	console.log('key', key)
	const items = await store.get(key)
	return items ? items : []
}

const getKey = (_date: string | number) => {
	const date = new Date(_date)
	return `${date.getFullYear()}_${date.getMonth()}`
}

const getId = (payload: AddMenuPayload) => {
	if (payload.id) return payload.id
	const date = new Date(payload.date)
	if (payload.groupCategory === 'junior') date.setHours(1)
	if (payload.groupCategory === 'middle') date.setHours(2)
	if (payload.groupCategory === 'senior') date.setHours(3)

	return date.getTime()
}

export const initMenusStoreListeners = () => {
	ipcMain.handle('getMenus', (_, date: string) => {
		console.log('GET MENUS', date)
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

	ipcMain.handle('addMenu', async (_, payload: AddMenuPayload) => {
		const id = getId(payload)
		console.log('id', id)
		const key = getKey(id)
		const menus = await getMenus(id)
		console.log('menus')
		const newMenu = {
			id,
			name: payload.name,
			date: payload.date,
			childrensCount: payload.childrensCount,
			items: payload.items,
			groupCategory: payload.groupCategory,
		}

		const menuExistIndex = menus.findIndex(
			it => String(it.id) === String(id),
		)

		console.log('menuExistIndex', menuExistIndex)

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
	childrensCount: number
	items: {
		name: string
		products: {
			productId: number
			count: number
		}[]
	}[]
}
