import { API } from '@/shared/core'
import { AddChildrenPayload, EditChildrenPayload } from 'electron/typing'

class ChildrenAPI extends API {
	protected basePath = 'childrens'

	public add(payload: AddChildrenPayload) {
		return this.call('add', payload)
	}

	public edit(payload: EditChildrenPayload) {
		return this.call('edit', payload)
	}
}

export const childrenAPI = new ChildrenAPI()
