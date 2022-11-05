import { GroupCategoryKey } from '@/@types/enums'

export interface IGroup {
	_id: string
	name: string

	category: GroupCategoryKey

	childrens?: IChildren[]
}

export interface IChildren {
	id: number
	name: string
	groupId: string
	birthday: string
	createdAt: string
}
