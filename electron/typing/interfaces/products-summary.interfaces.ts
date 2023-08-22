import { GroupCategoryKey, MeasurmentUnit } from '@/@types/enums'
import { IProduct } from '@/@types/interfaces'

export interface GenerateZdoDataXlsx {
	items: GenerateZdoXlsx[]

	name: string
	edrpoy: string
	daysInMonthCount: number
	director: string
	storekeeper: string
	date: Date
	responsiblePersonName: string
}

type Day = string
type RecipientsCount = number
export interface GenerateZdoXlsx {
	items: ZdoItem[]
	title: string
	subtitle: string
	date: string
	numberOfRecipients: number
	numberOfRecipientsByDays: Record<Day, RecipientsCount>
	category: GroupCategoryKey

	totalBruto: number
	totalNetto: number
	totalFree: number

	menusCount: number
}

export interface ZdoItem {
	price: number
	name: string
	measurmentUnit: string

	byDays: ZdoTableItem[]

	totalCount: number
	totalPrice: number
	totalFree: number
	totalNetto: number
}

export interface ZdoTableItem {
	date: number
	count: number
	summ: number

	freeCount: number
	freeSumm: number
}

export interface GenerateZdosXlsxParams {
	date: string // year/month
}
