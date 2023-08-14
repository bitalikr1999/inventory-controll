const XLSX = require('xlsx-js-style')
import 'moment/locale/uk'
import {
	XlsxReportCardConfig,
	XlsxReportCardData,
	XlsxReportCardGroup,
	XlsxReportCardItem,
} from './interfaces'
import { XlsxSheetGenerator } from 'electron/abstract'
import { generateMerge } from './helpers/merge-cols.helper'
import { xlsxVal, xlsxValСenter } from 'electron/helpers'
import _ from 'lodash'

export class ReportCardSheetXlsxGenerator extends XlsxSheetGenerator {
	protected group: XlsxReportCardGroup
	protected config: XlsxReportCardConfig
	protected setting: XlsxReportCardData['setting']

	public generate(
		group: XlsxReportCardGroup,
		setting: XlsxReportCardData['setting'],
	) {
		this.group = group
		this.setting = setting
		this.initWorksheet()
		this.initConfig()
		this.mergeCols()
		this.writeHead()
		this.writeTitle()
		this.writeTableHead()
		this.writeChilds()
		this.writeItemsSummary()

		return [this.getName(), this.worksheet]
	}

	protected getName() {
		return `${this.group.group.name}`
	}

	protected initConfig() {
		this.config = {
			startHead: [0, 1],
			startTitle: [9, 5],
			startTableRow: 9,
		}

		const childCount = this.group.items.length
		const tableHeadRowCount = 0 // start in this row
		const tableFooterRowCount = 2

		this.config.endTableRow =
			this.config.startTableRow +
			tableHeadRowCount +
			childCount +
			tableFooterRowCount

		this.config.startTableSummaryRow =
			this.config.startTableRow + tableHeadRowCount + childCount + 1

		this.config.startFooterRow = this.config.endTableRow + 2
	}

	protected mergeCols() {
		this.worksheet['!merges'] = generateMerge(this.config)
	}

	protected writeHead() {
		this.writeData(this.transformFromCords(this.config.startHead), [
			[xlsxVal(this.setting.name), false, 11],
			[xlsxVal('(найменування юридичної особи)'), false, 8],
			[xlsxVal('Ідентифікаційний '), false, 11],
			[
				xlsxVal('код ЄДРПОУ', false, 11),
				,
				xlsxVal(this.setting.edrpoy, false, 11, { bold: true }),
			],
		])
	}

	protected writeTitle() {
		this.writeData(this.transformFromCords(this.config.startTitle), [
			[xlsxValСenter('Табель', false, 18)],
			[
				xlsxValСenter(
					'щоденного харчування дітей групи раннього віку № 1',
					false,
					18,
				),
			],
			[xlsxValСenter('за червень 2023 року', false, 18)],
		])
	}

	protected writeTableHead() {
		const values = [xlsxVal("Прізвище ім'я", false, 15), , ,]

		for (let index = 0; index < this.setting.daysInMonthCount; index++) {
			values.push(xlsxValСenter(index + 1, false, 14))
		}

		values.push(
			xlsxVal(''),
			xlsxValСenter('Дітодні', false, 14),
			xlsxValСenter('Сума', false, 14),
			xlsxValСenter('60 %', false, 14),
			xlsxValСenter('50 %', false, 14),
			xlsxValСenter('100 %', false, 14),
		)

		this.writeData(
			this.transformFromCords([1, this.config.startTableRow]),
			[values],
		)
	}

	protected writeChilds() {
		const values: any[] = []

		this.group.items.map(item => {
			values.push(this.writeChild(item))
		})

		values.push([xlsxVal('Сума')])
		values.push([xlsxVal('Дні')])

		this.writeData(
			this.transformFromCords([1, this.config.startTableRow + 1]),
			values,
		)
	}

	protected writeChild(child: XlsxReportCardItem) {
		const values = [xlsxVal(child.childrenName, false, 14), , ,]

		for (let index = 1; index <= this.setting.daysInMonthCount; index++) {
			values.push(xlsxValСenter(child.values[String(index)], false, 11))
		}

		values.push(xlsxVal(''))
		values.push(xlsxValСenter(child.presentCound, false, 11))
		values.push(
			xlsxValСenter(Number(child.bruttoSumm).toFixed(2), false, 11),
		)
		values.push(
			xlsxValСenter(Number(child.nettoSumm).toFixed(2), false, 11),
		)
		if (child.isPay50)
			values.push(
				xlsxValСenter(Number(child.isPay50).toFixed(2), false, 11),
			)
		else values.push(xlsxVal(''))

		if (child.isPay0)
			values.push(
				xlsxValСenter(
					_.defaultTo(child.privilegeReason, ''),
					false,
					11,
				),
			)
		else values.push(xlsxVal(''))

		return values
	}

	protected writeItemsSummary() {
		const values = []
		const sums = []
		const counts = []

		for (let index = 1; index <= this.setting.daysInMonthCount; index++) {
			const summaryItem = this.group.summary[String(index)]
			if (summaryItem) {
				sums.push(
					xlsxValСenter(
						Number(summaryItem.summ).toFixed(2),
						false,
						11,
					),
				)
				counts.push(
					xlsxValСenter(
						Number(summaryItem.count).toFixed(0),
						false,
						11,
					),
				)
			} else {
				sums.push(xlsxVal(''))
				counts.push(xlsxVal(''))
			}
		}

		values.push(sums, counts)

		this.writeData(
			this.transformFromCords([4, this.config.startTableSummaryRow]),
			values,
		)
	}
}
