import { ipcMain } from 'electron'
import { getId } from 'electron/helpers'
import _ from 'lodash'
import path from 'path'
const Store = require('electron-store')

const store = new Store({
	name: 'childrens',
	cwd: path.join(__dirname, '..', '..', 'data'),
})

const getGroups = async () => {
	const data = await store.get('groups')
	return _.defaultTo(data, [])
}

const getChildrenId = async () => {
	const oldCount = await store.get('childrenCounter')
	const newCount = oldCount || oldCount === 0 ? Number(oldCount) + 1 : 0
	await store.set('childrenCounter', newCount)
	return newCount
}

export const initChildrensStoreListeners = () => {
	ipcMain.handle('getGroups', () => {
		return getGroups()
	})

	ipcMain.handle('getGroup', async (_, id: number) => {
		const groups = await getGroups()
		return groups.find((it: any) => Number(it.id) === Number(id))
	})

	ipcMain.handle('addGroup', async (_, _data: any) => {
		const groups = await getGroups()
		const group = {
			id: getId(groups),
			name: _data.name,
			createdAt: new Date(),
			category: _data.category,
		}
		await store.set('groups', [...groups, group])
		return group
	})

	ipcMain.handle('addChildren', async (_, _data: AddChildrenPayload) => {
		try {
			const groups = await getGroups()
			if (!groups) return

			await Promise.all(
				groups.map(async (it: any, i: number, arr: any) => {
					if (Number(it.id) !== _data.groupId) return

					if (!it.childrens) arr[i].childrens = []
					arr[i].childrens = [
						...it.childrens,
						{
							id: await getChildrenId(),
							name: _data.name,
							birthday: _data.birthday,
							createdAt: new Date(),
						},
					]
				}),
			)
			console.log(groups)

			await store.set('groups', [...groups])
		} catch (e) {
			console.log('eroro')
		}
	})
}

interface AddChildrenPayload {
	groupId: number
	name: string
	birthday: string
}
