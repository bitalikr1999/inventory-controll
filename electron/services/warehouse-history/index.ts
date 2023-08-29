import { InsertWarehouseItemPayload } from './interfaces'
import { IProduct, IWarehouseHistoryRecord } from '@/@types/interfaces'
import {
	warehouseHistoryRepository,
	warehouseRepository,
} from 'electron/repositories'
import { getFromStore } from 'electron/store'

class WarehouseHistoryService {
	public async insert(payload: InsertWarehouseItemPayload) {
		await warehouseHistoryRepository.insert(payload)
	}

	public async fetchAll() {
		const records = await warehouseHistoryRepository.find({})

		return this.fillArray(records)
	}

	public async fetchByWarehouseItem(warehouseId: string) {
		const records = await warehouseHistoryRepository.find({ warehouseId })

		return this.fillArray(records)
	}

	private async fillArray(records: IWarehouseHistoryRecord[]) {
		return await Promise.all(records.map(this.fillOne.bind(this)))
	}

	private async fillOne(record: IWarehouseHistoryRecord) {
		return {
			...record,
			product: await this.getProduct(record.productId),
			warehouseItem: await this.getWarehouseItem(record.warehouseId),
		}
	}

	private async getProduct(productId: number) {
		if (!productId) return null
		const products: IProduct[] = await getFromStore('products', 'list')
		const product = products.find(it => it.id === productId)
		return product
	}

	private async getWarehouseItem(itemId: string) {
		if (!itemId) return null

		const warehouseItem = await warehouseRepository.getOne({
			_id: itemId,
		})

		return warehouseItem
	}
}

export const warehouseHistoryService = new WarehouseHistoryService()
