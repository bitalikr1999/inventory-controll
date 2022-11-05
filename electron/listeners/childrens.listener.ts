import { ipcMain } from 'electron'
import { childrensRepository } from 'electron/store/childrens'
import { childrensGroupsRepository } from 'electron/store/childrens-groups'
import { AddChildrenPayload } from 'electron/typing'

export const initChildrensListener = () => {
	ipcMain.handle('getGroups', () => {
		console.log('log')
		return childrensGroupsRepository.find({})
	})

	ipcMain.handle('getGroup', async (_, id: string) => {
		const group = await childrensGroupsRepository.findOne({ _id: id })

		group.childrens = await childrensRepository.find({ groupId: id })

		return group
	})

	ipcMain.handle('addGroup', async (_, data: any) => {
		const result = await childrensGroupsRepository.insert({
			name: data.name,
			category: data.category,
		})
		return result
	})

	ipcMain.handle('addChildren', async (_, data: AddChildrenPayload) => {
		await childrensRepository.insert({
			name: String(data.name).trim(),
			groupId: String(data.groupId),
			birthday: new Date(data.birthday).toISOString(),
		})
	})
}
