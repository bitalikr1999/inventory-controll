import { Controller } from 'electron/abstract'
import { childrensRepository } from 'electron/repositories'
import { AddChildrenPayload, EditChildrenPayload } from 'electron/typing'
import { defaultTo } from 'lodash'

export class ChildrensController extends Controller {
	protected basePath = 'childrens'
	protected routes = {
		add: this.handleAdd,
		edit: this.handleEdit,
	}

	protected async handleAdd(_: unknown, data: AddChildrenPayload) {
		await childrensRepository.insert({
			name: String(data.name).trim(),
			groupId: String(data.groupId),
			birthday: new Date(data.birthday).toISOString(),
			paymentPercent: defaultTo(data.paymentPercent, 100),
			halfPaymentReason: String(data.halfPaymentReason),
		})
	}

	protected async handleEdit(_: unknown, data: EditChildrenPayload) {
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
	}
}
