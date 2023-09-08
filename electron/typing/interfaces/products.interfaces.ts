import { MeasurmentUnit, ProductCategory } from '@/@types/enums'

export interface IAddProductPayload {
	name: string
	price: number
	measurmentUnit: MeasurmentUnit
	category: ProductCategory
}

export interface IUpdateProductPayload extends Partial<IAddProductPayload> {
	_id: string
}
