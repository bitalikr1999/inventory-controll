import { ipcMain } from 'electron'
import { dbCwd } from 'electron/config'
import _ from 'lodash'
const Store = require('electron-store')

const store = new Store({
	name: 'menus',
	cwd: dbCwd,
})

const getMenus = async (_date: string) => {
	const key = getKey(_date)
	const items = await store.get(key)
	return items ? items : []
}

const getKey = (_date: string | number) => {
	const date = new Date(_date)
	return `${date.getFullYear()}_${date.getMonth()}`
}

const getId = (payload: AddMenuPayload) => {
	return new Date(payload.date).getTime()
}

export const initMenusStoreListeners = () => {
	ipcMain.handle('getMenus', (_, date: string) => {
		return getMenus(date)
	})

	// ipcMain.handle('getMenu', async (_, id: number) => {
	// 	const groups = await getGroups()
	// 	return groups.find((it: any) => Number(it.id) === Number(id))
	// })

	ipcMain.handle('addMenu', async (_, payload: AddMenuPayload) => {
		const id = getId(payload)
		console.log('id', id)
		const key = getKey(id)
		console.log('key', key)
		const menus = await getMenus(String(id))

		const newMenu = {
			id,
			name: payload.name,
			date: payload.date,
			items: payload.items,
		}

		console.log('new menu', newMenu)

		await store.set(key, [...menus, newMenu])
		return newMenu
	})
}

interface AddMenuPayload {
	id?: number
	name: string
	date: string
	items: {
		name: string
		products: {
			productId: number
			count: number
		}[]
	}[]
}
