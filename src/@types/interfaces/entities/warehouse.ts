import { IProduct } from './product'

export interface IWarehouseItem {
	_id: string
	productId: number

	count: number
	price: number
	defaultCount: number
	createdAt: string

	product?: IProduct
}
