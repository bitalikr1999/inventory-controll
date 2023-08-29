import path from 'path'
import _ from 'lodash'

import { app } from 'electron'
import { Repository } from 'electron/abstract'

import { IWarehouseItem } from '@/@types/interfaces'

class WarehouseRepository extends Repository<IWarehouseItem> {
	public async getAll() {
		return new Promise<IWarehouseItem[]>((resolve, reject) => {
			this.db.find({}, (err: any, docs: IWarehouseItem[]) => {
				if (err) reject(err)
				resolve(docs)
			})
		})
	}

	public async getOne(params: any) {
		return new Promise<IWarehouseItem>((resolve, reject) => {
			this.db.findOne(params, (err: any, item: any) => {
				if (err) reject(err)
				resolve(item)
			})
		})
	}

	async update(_id: string, data: Partial<IWarehouseItem>) {
		return new Promise((resolve, reject) => {
			this.db.update({ _id }, { $set: data }, (err: any) => {
				if (err) reject(err)
				resolve(null)
			})
		})
	}

	public async decreaseWarehouseItemCount(id: number, count: number) {
		const item = await this.getOne({ _id: id })
		return new Promise((resolve, reject) => {
			const resCount = Number(item.count) - Number(count)
			this.db.update(
				{ _id: id },
				{ $set: { count: Math.max(resCount, 0) } },
				(err: null) => {
					if (err) reject(err)
					resolve(null)
				},
			)
		})
	}

	public async increaseWarehouseItemCount(id: number, count: number) {
		const item = await this.getOne({ _id: id })
		return new Promise((resolve, reject) => {
			const resCount = Number(item.count) + Number(count)
			this.db.update(
				{ _id: id },
				{ $set: { count: Math.max(resCount, 0) } },
				(err: null) => {
					if (err) reject(err)
					resolve(null)
				},
			)
		})
	}
}

const repoFilePath = path.join(
	app.getPath('appData'),
	'foodAccountingData',
	'warehouse.db',
)
export const warehouseRepository = new WarehouseRepository()
	.setPath(repoFilePath)
	.initDb()
