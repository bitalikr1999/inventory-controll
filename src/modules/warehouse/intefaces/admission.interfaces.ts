import { IProduct } from '@/@types/interfaces'

export interface IWarehouseAdmissionItem {
	product?: IProduct

	summ?: number
	count: number
}
