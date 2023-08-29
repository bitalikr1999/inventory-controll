import { API } from '@/shared/core'

class WarehouseHistoryAPI extends API {
	protected basePath = 'warehouseHistory'

	public getAll() {
		return this.call('getAll', {})
	}
}

export const warehouseHistoryAPI = new WarehouseHistoryAPI()
