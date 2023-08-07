import { MeasurmentUnit, ProductCategory } from '@/@types/enums'

export interface IProduct {
	id: number
	name: string
	price: number
	measurmentUnit: MeasurmentUnit
	createdAt: string

	category?: ProductCategory
}
