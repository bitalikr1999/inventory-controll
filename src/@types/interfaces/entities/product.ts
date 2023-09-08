import { MeasurmentUnit, ProductCategory } from '@/@types/enums'

export interface IProduct {
	_id: string
	// id: number
	name: string
	price: number
	measurmentUnit: MeasurmentUnit
	createdAt: string

	category?: ProductCategory
}
