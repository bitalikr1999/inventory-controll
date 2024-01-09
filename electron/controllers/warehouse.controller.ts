import { HistoryRecordReasone, HistoryRecordType } from '@/@types/enums'
import { IWarehouseItem } from '@/@types/interfaces'
import { Controller } from 'electron/abstract'
import { WarehouseAdmission, WarehouseSubstruct } from 'electron/core/warehouse'
import {
	warehouseHistoryRepository,
	warehouseRepository,
} from 'electron/repositories'
import {
	IAddWarehouseAdmissionPayload,
	ISubsctructWarehouseItemsPayload,
} from 'electron/typing'

export class WarehouseController extends Controller {
	protected basePath = 'warehouse'
	protected routes = {
		get: this.getWarehouseItems,
		delete: this.deleteWarehouseItem,
		admission: this.admission,
		substruct: this.substruct,
	}

	protected async getWarehouseItems() {
		return await warehouseRepository.getAll()
	}

	protected async deleteWarehouseItem(_: any, data: any) {
		return await warehouseRepository.remove(data.id)
	}

	protected async admission(
		_event: unknown,
		data: IAddWarehouseAdmissionPayload,
	) {
		for await (const payload of data.items) {
			await new WarehouseAdmission(payload).admission()
		}
	}

	protected async substruct(
		_event: unknown,
		data: ISubsctructWarehouseItemsPayload,
	) {
		for await (const payload of data.items) {
			await new WarehouseSubstruct(payload).run()
		}
	}
}
