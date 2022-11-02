import { dbCwd } from 'electron/config'
import path from 'path'

import { app, ipcMain } from 'electron'
import { IAddWarehouseAdmissionPayload } from 'electron/typing'
import { IWarehouseItem } from '@/@types/interfaces'
import _ from 'lodash'

const { v4: uuidv4 } = require('uuid')
const Datastore = require('nedb')
export const warehouseDb = new Datastore({
	filename: path.join(
		app.getPath('appData'),
		'foodAccountingData',
		'warehouse.db',
	),
	autoload: true,
	timestampData: true,
})

const getAll = async () => {
	return new Promise<IWarehouseItem[]>((resolve, reject) => {
		warehouseDb.find({}, (err: any, docs: IWarehouseItem[]) => {
			console.log('docs', docs)
			if (err) reject(err)
			resolve(docs)
		})
	})
}

const getOne = async (params: any) => {
	return new Promise<IWarehouseItem>((resolve, reject) => {
		warehouseDb.findOne(params, (err: any, item: any) => {
			if (err) reject(err)
			resolve(item)
		})
	})
}

const update = async (_id: string, data: Partial<IWarehouseItem>) => {
	return new Promise((resolve, reject) => {
		warehouseDb.update({ _id }, { $set: data }, (err: any) => {
			if (err) reject(err)
			resolve(null)
		})
	})
}

const insert = async (data: Partial<IWarehouseItem>) => {
	return new Promise((resolve, reject) => {
		warehouseDb.insert(data, (err: any) => {
			if (err) reject(err)
			resolve(null)
		})
	})
}

const remove = async (id: number) => {
	return new Promise((resolve, reject) => {
		warehouseDb.remove({ _id: id }, {}, (err: any) => {
			if (err) reject(err)
			resolve(null)
		})
	})
}

export const decreaseWarehouseItemCount = async (id: number, count: number) => {
	const item = await getOne({ _id: id })
	return new Promise((resolve, reject) => {
		const resCount = Number(item.count) - Number(count)
		warehouseDb.update(
			{ _id: id },
			{ $set: { count: Math.max(resCount, 0) } },
			(err: null) => {
				if (err) reject(err)
				resolve(null)
			},
		)
	})
}

export const increaseWarehouseItemCount = async (id: number, count: number) => {
	const item = await getOne({ _id: id })
	return new Promise((resolve, reject) => {
		const resCount = Number(item.count) + Number(count)
		warehouseDb.update(
			{ _id: id },
			{ $set: { count: Math.max(resCount, 0) } },
			(err: null) => {
				if (err) reject(err)
				resolve(null)
			},
		)
	})
}

export const initWarehouseListeners = () => {
	ipcMain.handle(
		'warehouseAdmission',
		async (_, data: IAddWarehouseAdmissionPayload) => {
			await Promise.all(
				data.items.map(async item => {
					const exist = await getOne({
						price: item.price,
						productId: item.product.id,
					})
					if (exist) {
						await update(exist._id, {
							count: Number(exist.count) + Number(item.count),
						})
					} else {
						await insert({
							count: Number(item.count),
							productId: item.product.id,
							price: Number(item.price),
						})
					}
				}),
			)
		},
	)

	ipcMain.handle('getWarehouseItems', async (_, data: any) => {
		return await getAll()
	})

	ipcMain.handle('deleteWarehouseItem', async (_, data: any) => {
		return await remove(data.id)
	})
}
