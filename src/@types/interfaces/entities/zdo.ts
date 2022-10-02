import { IProduct } from './product'

export interface ZdoItem {
	product: IProduct
	byDays: ZdoTableItem[]
	totalCount: number
	totalPrice: number
}

export interface ZdoTableItem {
	date: number
	count: number
	price: number
}
