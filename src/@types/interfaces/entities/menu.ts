import { GroupCategoryKey } from '@/@types/enums'
import { IProduct } from './product'

export interface IMenu {
	id: number
	name: string
	date: string
	groupCategory: GroupCategoryKey
	items?: IMenuItem[]
}

export interface IMenuItem {
	id: string
	name: string
	period: MenuItemPeriod
	products: IMenuItemProduct[]
}

export interface IMenuItemProduct {
	id: string
	product: IProduct
	count: string | number
}

export type MenuItemPeriod = 'mornin' | 'dinner' | 'supper'
