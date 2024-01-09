import { HistoryRecordReasone, HistoryRecordType } from '@/@types/enums'
import { IWarehouseItem } from '@/@types/interfaces'
import { IWarehouseAdmissionItem } from '@/modules/warehouse/intefaces'
import {
	warehouseHistoryRepository,
	warehouseRepository,
} from 'electron/repositories'

export class WarehouseAdmission {
	constructor(private payload: IWarehouseAdmissionItem) {}

	get price() {
		return Number(Number(this.payload?.price).toFixed(2))
	}

	get productId() {
		return this.payload.product?._id
	}

	public async admission() {
		try {
			await this.execute()
			this.addHistoryPoint()
		} catch (e) {
			console.log(e)
		}
	}

	private async execute() {
		const exist = await this.getExistItem()
		if (exist) await this.update(exist)
		else await this.create()
	}

	private async getExistItem() {
		return await warehouseRepository.getOne({
			price: this.price,
			productId: this.productId,
		})
	}

	private async update(item: IWarehouseItem) {
		await warehouseRepository.update(item._id, {
			count: Number(item.count) + Number(this.payload.count),
		})
	}

	private async create() {
		await warehouseRepository.insert({
			count: Number(this.payload.count),
			productId: this.productId,
			price: this.price,
		})
	}

	private async addHistoryPoint() {
		const item = await this.getExistItem()
		await warehouseHistoryRepository.insert({
			warehouseId: item._id,
			productId: item.productId,

			type: HistoryRecordType.Income,
			reasone: HistoryRecordReasone.Admission,

			productCount: Number(this.payload.count),
			price: Number(this.price),

			comment: '',
		})
	}
}
