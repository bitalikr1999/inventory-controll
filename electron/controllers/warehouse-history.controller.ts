import { Controller } from 'electron/abstract'
import { warehouseHistoryService } from 'electron/services'

export class WarehouseHistoryController extends Controller {
	protected basePath = 'warehouseHistory'
	protected routes = {
		getAll: this.handleGetAll,
		getByItem: this.handleGetByItem,
	}

	protected handleGetAll() {
		return warehouseHistoryService.fetchAll()
	}

	protected handleGetByItem(_: unknown, warehouseItemId: string) {
		return warehouseHistoryService.fetchByWarehouseItem(warehouseItemId)
	}
}
