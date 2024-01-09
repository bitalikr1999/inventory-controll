import { IProduct } from '@/@types/interfaces'

export interface IAddWarehouseAdmissionItem {
	product?: IProduct

	price?: number
	count: number
}

export interface IAddWarehouseAdmissionPayload {
	items: IAddWarehouseAdmissionItem[]
	comment?: string
}

export interface ISubsctructWarehouseItemPayload {
	warehouseItemId: string
	count: number
}

export interface ISubsctructWarehouseItemsPayload {
	items: ISubsctructWarehouseItemPayload[]
}
