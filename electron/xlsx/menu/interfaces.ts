import { IProduct } from '../zdo'

export interface IMenu {
	id: number
	name: string
	date: string
	groupCategory: any
	items?: IMenuItem[]
	itemsByPeriod?: Partial<Record<MenuItemPeriod, IMenuItem[]>>
	itemsByRows?: [IMenuItem[], IMenuItem[], IMenuItem[]]
	childrensCount?: number
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

export interface IMenuTableConfig {
	startHeader?: number
	maxIndgedientsCount?: any
	maxDishesCount?: number
	dishesStartRow?: number
	dishesSummaryRow?: number
}
