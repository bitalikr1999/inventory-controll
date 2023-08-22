import { IWarehouseItem } from '@/@types/interfaces'
import { API } from '@/shared/core'
import { IAddWarehouseAdmissionPayload } from 'electron/typing'

class WarehouseAPI extends API {
	protected basePath = 'warehouse'

	public get(): Promise<IWarehouseItem[]> {
		return this.call('get', {})
	}

	public delete(id: string) {
		return this.call('delete', { id })
	}

	public admission(data: IAddWarehouseAdmissionPayload) {
		return this.call('admission', data)
	}
}

export const warehouseAPI = new WarehouseAPI()
