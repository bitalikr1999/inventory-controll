import { HistoryRecordReasone, HistoryRecordType } from '@/@types/enums'

export interface InsertWarehouseItemPayload {
	warehouseId?: string
	productId?: string

	type: HistoryRecordType
	reasone: HistoryRecordReasone

	productCount: number
	price: number

	comment?: string
}
