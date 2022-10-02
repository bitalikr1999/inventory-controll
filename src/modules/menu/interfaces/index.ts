import { GroupCategoryKey } from '@/@types/enums'
import { IProduct } from '@/@types/interfaces'

export interface MenuEditorForm {
	title: string
	date: Date
	pressAdd: () => void
	items: MenuEditorItem[]
	groupCategory: GroupCategoryKey
}

export interface MenuEditorItem {
	id: string
	name: string
	period: MenuItemPeriod
	products: MenuEditorProduct[]
}

export interface MenuEditorProduct {
	id: string
	product: IProduct
	count: string | number
}

export type MenuItemPeriod = 'mornin' | 'dinner' | 'supper'
