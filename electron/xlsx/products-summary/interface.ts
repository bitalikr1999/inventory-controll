import { XlsxCoords } from 'electron/typing'

export interface XlsxProductsSummaryConfig {
	startHead?: XlsxCoords
	startTitle?: XlsxCoords
	startResponsiblePerson?: number
	startTableRow?: number
	startTableItemsRow?: number
	startTableSummaryRow?: number
	endTableRow?: number
	startFooterRow?: number

	daysInMonthCount?: number
}
