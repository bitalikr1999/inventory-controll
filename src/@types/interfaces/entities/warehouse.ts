import { IProduct } from './product'

export interface IWarehouseItem {
	id: number
	productId: number

	count: number
	price: number
	defaultCount: number
	createdAt: string

	product?: IProduct
}
