import { GroupCategoryKey } from '@/@types/enums'

export interface IMenu {
	id: number
	name: string
	date: string
	groupCategory: GroupCategoryKey
	items: any[]
}
