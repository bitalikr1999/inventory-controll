import { IProduct } from '../zdo'

export interface IItemsRow {
	m?: IMenuItem
	d?: IMenuItem
	e?: IMenuItem
}
export interface IMenu {
	id: number
	name: string
	date: string
	groupCategory: any
	items?: IMenuItem[]
	itemsByPeriod?: Partial<Record<MenuItemPeriod, IMenuItem[]>>
	itemsByRows?: IItemsRow[]

	//[IMenuItem[], IMenuItem[], IMenuItem[]]
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
	count: number
}

export type MenuItemPeriod = 'mornin' | 'dinner' | 'supper'

export interface IRowConfig {
	headerRow: number
	start: number
	end: number
	summRow: number
	summ2Row: number
}
export interface IMenuTableConfig {
	startHeader?: number
	maxIndgedientsCount?: any
	maxDishesCount?: number
	dishesStartRow?: number
	dishesSummaryRow?: number
	rowsConfig?: IRowConfig[]
	childrensCount?: number
}
