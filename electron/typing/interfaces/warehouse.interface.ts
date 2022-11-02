import { IProduct } from '@/@types/interfaces'

export interface IAddWarehouseAdmissionItem {
	product?: IProduct

	price?: number
	count: number
}

export interface IAddWarehouseAdmissionPayload {
	items: IAddWarehouseAdmissionItem[]
}
