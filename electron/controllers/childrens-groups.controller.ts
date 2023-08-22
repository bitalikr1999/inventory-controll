import { Controller } from 'electron/abstract'
import {
	childrensGroupsRepository,
	childrensRepository,
} from 'electron/repositories'

export class ChildrensGroupsController extends Controller {
	protected basePath = 'childrensGroups'
	protected routes = {
		getAll: this.handleGetAll,
		getOne: this.handleGetOne,
		add: this.handleAdd,
		edit: this.handleEdit,
	}

	protected async handleGetAll() {
		const groups = await childrensGroupsRepository.find({})

		for await (const [index, group] of groups.entries()) {
			groups[index].childrens = await childrensRepository.find({
				groupId: group._id,
			})
		}

		return groups
	}

	protected async handleGetOne(_: unknown, id: string) {
		const group = await childrensGroupsRepository.findOne({ _id: id })
		group.childrens = await childrensRepository.find({ groupId: id })
		return group
	}

	protected async handleAdd(_: unknown, data: any) {
		const group = await childrensGroupsRepository.insert({
			name: data.name,
			category: data.category,
			reportCardTitle: data.reportCardTitle,
		})
		return group
	}

	protected async handleEdit(_: unknown, data: any) {
		const group = await childrensGroupsRepository.updateOne(
			{ _id: data._id },
			{
				name: data.name,
				category: data.category,
				reportCardTitle: data.reportCardTitle,
			},
		)
		return group
	}
}
