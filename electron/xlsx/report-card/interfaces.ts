import { IChildren, IChildrenCalendarRecord, IGroup } from '@/@types/interfaces'
import { XlsxCoords } from 'electron/typing'

export interface XlsxReportCardItem {
	childrenName: string
	values: Record<string, string>
	presentCound: number
	bruttoSumm: number
	nettoSumm: number

	isPay50: number
	isPay0: number

	privilegeReason?: String
}

export interface XlsxReportCardGroup {
	group: IGroup
	calendar: IChildrenCalendarRecord
	items: XlsxReportCardItem[]
	summary: Record<string, { summ: number; count: number }>
	total?: {
		visitingCount: number
		brutto: number
		netto: number
		isPay50: number
	}
}

export interface XlsxReportCardData {
	date: Date
	groups: XlsxReportCardGroup[]
	setting: {
		name: string
		edrpoy: string
		daysInMonthCount: number
	}
}

export interface XlsxReportCardConfig {
	startHead?: XlsxCoords
	startTitle?: XlsxCoords
	startTableRow?: number
	startTableSummaryRow?: number
	endTableRow?: number
	startFooterRow?: number
}
