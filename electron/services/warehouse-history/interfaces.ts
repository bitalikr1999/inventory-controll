import { HistoryRecordReasone, HistoryRecordType } from '@/@types/enums'

export interface InsertWarehouseItemPayload {
	warehouseId?: string
	productId?: number

	type: HistoryRecordType
	reasone: HistoryRecordReasone

	productCount: number
	price: number

	comment?: string
}
