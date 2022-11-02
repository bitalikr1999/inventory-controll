import { MeasurmentUnit } from '@/@types/enums'

export interface AddMenuPayload {
	id?: number
	name: string
	date: string
	groupCategory: string
	childrensCount: number
	items: {
		id: string
		weight: string
		name: string

		products: {
			id: string
			product?: {
				warehouseId: string
				productId: number
				price: number
				name: string
				measurmentUnit: MeasurmentUnit
				maxCount?: number
			}
			count: number
		}[]
	}[]
}

export interface IMenu {
	id?: number
	name: string
	date: string
	groupCategory: string
	childrensCount: number
	items: {
		id: string
		weight: string
		name: string

		products: {
			id: string
			product?: {
				warehouseId: string
				productId: number
				price: number
				name: string
				measurmentUnit: MeasurmentUnit
				maxCount?: number
			}
			count: number
		}[]
	}[]
}
