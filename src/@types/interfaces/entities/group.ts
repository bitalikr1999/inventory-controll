import { GroupCategoryKey } from '@/@types/enums'

export interface IGroup {
	_id: string
	name: string

	category: GroupCategoryKey

	childrens?: IChildren[]

	reportCardTitle?: string
}

export interface IChildren {
	_id: string
	name: string
	groupId: string
	birthday: string
	createdAt: string

	paymentPercent?: number
	halfPaymentReason?: string
}

export interface IChildrenCalendarChild {
	childId: string
	groupCategory?: GroupCategoryKey
	visiting: {
		day: number
		isPresent: boolean
	}[]
}

export interface IChildrenCalendarRecord {
	_id?: string
	groupId: string
	date: string
	items: IChildrenCalendarChild[]

	createdAt?: string
}
