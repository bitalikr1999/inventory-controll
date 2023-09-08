import { MeasurmentUnit } from '@/@types/enums'

export interface AddMenuPayload {
	id?: string
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
				productId: string
				price: number
				name: string
				measurmentUnit: MeasurmentUnit
				maxCount?: number
			}
			count: number
		}[]
	}[]
}

export interface IMenuItemProduct {
	id: string
	product?: {
		warehouseId: string
		productId: string
		price: number
		name: string
		measurmentUnit: string
		maxCount?: number
	}
	count: number
	isFree?: boolean
}

export interface IMenuItem {
	id: string
	weight: string
	name: string

	products: IMenuItemProduct[]
}
export interface IMenu {
	_id?: string
	name: string
	date: string
	dateGroupKey: string
	groupCategory: string
	childrensCount: number
	items: IMenuItem[]
}

export interface GetMenusParams {
	date: string
	childrenGroup: string
}
