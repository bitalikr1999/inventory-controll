import { GroupCategoryKey, MeasurmentUnit } from '@/@types/enums'
import { IProduct } from './product'

// export interface IMenu {
// 	_id: string
// 	name: string
// 	date: string
// 	groupCategory: GroupCategoryKey
// 	items?: IMenuItem[]
// }

export interface IMenuItem {
	id: string
	name: string
	period: MenuItemPeriod
	products: IMenuItemProduct[]
}

export interface IMenuItemProduct {
	id: string
	product?: {
		warehouseId?: string
		productId?: number
		price: number
		name?: string
		measurmentUnit: MeasurmentUnit
		maxCount?: number
	}
	count: number
}

export type MenuItemPeriod = 'mornin' | 'dinner' | 'supper'
