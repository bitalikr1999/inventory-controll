import { GroupCategoryKey, MeasurmentUnit } from '@/@types/enums'
import { IProduct, IWarehouseItem } from '@/@types/interfaces'

export interface MenuEditorForm {
	title: string
	date: Date
	childrensCount: number
	pressAdd: () => void
	items: MenuEditorItem[]
	groupCategory: GroupCategoryKey
}

export interface MenuEditorItem {
	id: string
	name: string
	weight: string
	period: MenuItemPeriod
	products?: MenuEditorProduct[]
}

export interface MenuEditorProduct {
	id: string
	product?: {
		warehouseId: string
		productId: number
		price: number
		name: string
		measurmentUnit: MeasurmentUnit
		maxCount?: number
	}
	count: string | number
}

export type MenuItemPeriod = 'mornin' | 'dinner' | 'supper'
