import { GroupCategoryKey } from '@/@types/enums'

export interface IGetPresentChildrenParams {
	groupCategory?: GroupCategoryKey
	date?: string // year/month format
	day?: number
}

export interface IGenerateXlsxReportCardParams {
	date: string // year/month
}

export interface GetOneChildrensCalendarParams {
	groupId: string
	date: string
}
