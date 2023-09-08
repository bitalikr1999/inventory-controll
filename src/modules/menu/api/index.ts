import { API } from '@/shared/core'

class MenusAPI extends API {
	protected basePath = 'menus'

	public getMany(date: Date) {
		return this.call('getMany', { date: date.toISOString() })
	}

	public put(data: any) {
		return this.call('put', data)
	}

	public remove(id: string) {
		return this.call('remove', id)
	}

	public getOne(id: string) {
		return this.call('getOne', id)
	}

	public generateXlsx(data: any) {
		return this.call('generateXlsx', data)
	}
}

export const menusAPI = new MenusAPI()
