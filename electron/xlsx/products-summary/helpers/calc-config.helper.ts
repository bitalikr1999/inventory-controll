import { GenerateZdoDataXlsx, GenerateZdoXlsx } from 'electron/typing'
import { XlsxProductsSummaryConfig } from '../interface'

export const calcConfig = (
	data: GenerateZdoXlsx,
	settings: GenerateZdoDataXlsx,
) => {
	const config: XlsxProductsSummaryConfig = {
		startOrderInfo: [5 + settings.daysInMonthCount - 5, 0],
		startHead: [0, 3],
		startTitle: [9, 7],
		startResponsiblePerson: 11,
		daysInMonthCount: Number(settings.daysInMonthCount),
	}

	const childCount = data.items.length
	const tableHeadRowCount = 3 // start in this row
	const tableFooterRowCount = 2
	const summaryRowCount = 2
	const summarySpace = 1
	const footerSpaceFromSummary = 2

	config.startTableRow = config.startResponsiblePerson + 2
	config.startTableItemsRow = config.startTableRow + tableHeadRowCount

	config.endTableRow =
		config.startTableRow +
		tableHeadRowCount +
		childCount +
		tableFooterRowCount

	config.startTableSummaryRow =
		config.startTableRow + tableHeadRowCount + childCount + summarySpace

	config.startFooterRow =
		config.startTableSummaryRow + summaryRowCount + footerSpaceFromSummary

	return config
}
