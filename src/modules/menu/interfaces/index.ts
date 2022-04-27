import { IProduct } from '@/@types/interfaces'

export interface MenuEditorForm {
	title: string
	pressAdd: () => void
	items: MenuEditorItem[]
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
