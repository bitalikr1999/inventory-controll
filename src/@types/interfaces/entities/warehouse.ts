import { HistoryRecordReasone, HistoryRecordType } from '@/@types/enums'
import { IProduct } from './product'

export interface IWarehouseItem {
	_id: string
	productId: string

	count: number
	price: number
	defaultCount: number
	createdAt: string

	product?: IProduct
}

export interface IWarehouseHistoryRecord {
	_id: string

	warehouseId?: string
	productId?: string

	type: HistoryRecordType
	reasone: HistoryRecordReasone

	productCount: number
	price: number

	comment?: string

	createdAt?: string

	product?: IProduct
	warehouseItem?: IWarehouseItem
}
