import { Controller } from 'electron/abstract'
import { warehouseRepository } from 'electron/repositories'
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
				item.price = Number(Number(item.price).toFixed(2))

				const exist = await warehouseRepository.getOne({
					price: item.price,
					productId: item.product.id,
				})
				if (exist) {
					await warehouseRepository.update(exist._id, {
						count: Number(exist.count) + Number(item.count),
					})
				} else {
					await warehouseRepository.insert({
						count: Number(item.count),
						productId: item.product.id,
						price: Number(item.price),
					})
				}
			}),
		)
	}
}
