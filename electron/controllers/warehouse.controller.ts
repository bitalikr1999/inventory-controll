import { HistoryRecordReasone, HistoryRecordType } from '@/@types/enums'
import { IWarehouseItem } from '@/@types/interfaces'
import { Controller } from 'electron/abstract'
import {
	warehouseHistoryRepository,
	warehouseRepository,
} from 'electron/repositories'
import { IAddWarehouseAdmissionPayload } from 'electron/typing'

export class WarehouseController extends Controller {
	protected basePath = 'warehouse'
	protected routes = {
		get: this.getWarehouseItems,
		delete: this.deleteWarehouseItem,
		admission: this.admission,
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
		await Promise.all(
			data.items.map(async item => {
				try {
					item.price = Number(Number(item.price).toFixed(2))

					const exist = await warehouseRepository.getOne({
						price: item.price,
						productId: item.product._id,
					})
					let warehouseItem: IWarehouseItem = exist

					if (exist) {
						await warehouseRepository.update(exist._id, {
							count: Number(exist.count) + Number(item.count),
						})
					} else {
						warehouseItem = await warehouseRepository.insert({
							count: Number(item.count),
							productId: item.product._id,
							price: Number(item.price),
						})
					}

					await warehouseHistoryRepository.insert({
						warehouseId: warehouseItem._id,
						productId: warehouseItem.productId,

						type: HistoryRecordType.Income,
						reasone: HistoryRecordReasone.Admission,

						productCount: item.count,
						price: item.price,

						comment: data.comment,
					})
				} catch (e) {
					console.log(e)
				}
			}),
		)
	}
}
