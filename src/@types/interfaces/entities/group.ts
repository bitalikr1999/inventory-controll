import { GroupCategoryKey } from '@/@types/enums'

export interface IGroup {
	name: string
	childrens: IChildren[]
	id: number
	category: GroupCategoryKey
}

export interface IChildren {
	id: number
	name: string
	birthday: string
	createdAt: string
}
