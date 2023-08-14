import { GroupCategoryKey } from '@/@types/enums'

export interface ICountChildrenCountParams {
	groupCategory?: GroupCategoryKey
	date?: string // year/month format
	day?: number
}

export interface IGenerateXlsxReportCardParams {
	date: string // year/month
}
