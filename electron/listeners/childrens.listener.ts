import { ipcMain } from 'electron'
import { childrensRepository } from 'electron/store/childrens'
import { childrensGroupsRepository } from 'electron/store/childrens-groups'
import { AddChildrenPayload, EditChildrenPayload } from 'electron/typing'
import { defaultTo } from 'lodash'

export const initChildrensListener = () => {
	ipcMain.handle('getGroups', async () => {
		const groups = await childrensGroupsRepository.find({})

		for await (const [index, group] of groups.entries()) {
			groups[index].childrens = await childrensRepository.find({
				groupId: group._id,
			})
		}

		return groups
	})

	ipcMain.handle('getGroup', async (_, id: string) => {
		const group = await childrensGroupsRepository.findOne({ _id: id })
		console.log('asdasdas', id)

		group.childrens = await childrensRepository.find({ groupId: id })

		return group
	})

	ipcMain.handle('addGroup', async (_, data: any) => {
		const result = await childrensGroupsRepository.insert({
			name: data.name,
			category: data.category,
			reportCardTitle: data.reportCardTitle,
		})
		return result
	})

	ipcMain.handle('editGroup', async (_, data: any) => {
		const result = await childrensGroupsRepository.updateOne(
			{ _id: data._id },
			{
				name: data.name,
				category: data.category,
				reportCardTitle: data.reportCardTitle,
			},
		)
		return result
	})

	ipcMain.handle('addChildren', async (_, data: AddChildrenPayload) => {
		await childrensRepository.insert({
			name: String(data.name).trim(),
			groupId: String(data.groupId),
			birthday: new Date(data.birthday).toISOString(),
			paymentPercent: defaultTo(data.paymentPercent, 100),
			halfPaymentReason: String(data.halfPaymentReason),
		})
	})

	ipcMain.handle('editChildren', async (_, data: EditChildrenPayload) => {
		await childrensRepository.updateOne(
			{ _id: data._id },
			{
				name: String(data.name).trim(),
				groupId: String(data.groupId),
				birthday: new Date(data.birthday).toISOString(),
				paymentPercent: defaultTo(data.paymentPercent, 100),
				halfPaymentReason: String(data.halfPaymentReason),
			},
		)
	})
}
