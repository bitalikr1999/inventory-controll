import {
	XlsxReportCardConfig,
	XlsxReportCardData,
	XlsxReportCardGroup,
} from './interfaces'
import { shell } from 'electron'
import { publicCwd } from 'electron/config'

import { writeFile } from 'fs'
import moment from 'moment'
const XLSX = require('xlsx-js-style')
import 'moment/locale/uk'
import path from 'path'
import { ReportCardSheetXlsxGenerator } from './report-card-sheet'

export class ReportCardXlsxGenerator {
	private data: XlsxReportCardData
	private workbook: any

	public async generate(data: XlsxReportCardData) {
		this.data = data

		this.createWorkbook()
		console.log('createWorkbook')
		this.generateSheets()
		console.log('generateSheets')

		this.writeFile()
	}

	protected generateSheets() {
		console.log('GROUPS COUNT', this.data.groups.length)
		this.data.groups.map(it => {
			this.generateSheet(it)
		})
	}

	protected generateSheet(group: XlsxReportCardGroup) {
		const sheetGenerator = new ReportCardSheetXlsxGenerator()

		const [name, worksheet] = sheetGenerator.generate(
			group,
			this.data.setting,
		)

		XLSX.utils.book_append_sheet(this.workbook, worksheet, name)
	}

	protected createWorkbook() {
		this.workbook = XLSX.utils.book_new()
	}

	protected writeFile() {
		const buf = XLSX.write(this.workbook, {
			type: 'buffer',
			bookType: 'xlsx',
		})

		const name = this.generateName()

		writeFile(path.join(publicCwd, name), buf, err => {
			console.log('error', err)
			shell.showItemInFolder(path.join(publicCwd, name))
		})
	}

	protected generateName() {
		const date = this.data.date

		return `Табелі_за_${moment(date).format('DD.MM.YYYY')}.xlsx`
	}
}
