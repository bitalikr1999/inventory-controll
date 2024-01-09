import { IWarehouseItem } from '@/@types/interfaces'
import { warehouseRepository } from 'electron/repositories'
import { ISubsctructWarehouseItemPayload } from 'electron/typing'

export class WarehouseSubstruct {
	private item: IWarehouseItem
	private newCount: number

	constructor(private readonly payload: ISubsctructWarehouseItemPayload) {}

	private get exitItemCount() {
		return this.item ? Number(this.item.count) : 0
	}

	public async run() {
		try {
			await this.calc()
			await this.save()
		} catch (e) {
			console.log(e)
		}
	}

	private async calc() {
		this.item = await this.getExistItem()
		this.newCount = this.getNewCount()
	}

	private async getExistItem() {
		const item = await warehouseRepository.getOne({
			_id: this.payload.warehouseItemId,
		})
		if (!item) throw new Error('Item not exist')
		return item
	}

	private getNewCount() {
		const result = this.exitItemCount - Number(this.payload.count)

		return result >= 0 ? result : 0
	}

	private async save() {
		await warehouseRepository.update(this.item._id, {
			count: this.newCount,
		})
	}
}
