import { API } from '@/shared/core'

class ChildrensGroupsAPI extends API {
	protected basePath = 'childrensGroups'

	public getAll() {
		return this.call('getAll', {})
	}

	public getOne(id: string) {
		return this.call('getOne', id)
	}

	public add(payload: any) {
		return this.call('add', payload)
	}

	public edit(payload: any) {
		return this.call('edit', payload)
	}
}

export const childrensGroupsAPI = new ChildrensGroupsAPI()
