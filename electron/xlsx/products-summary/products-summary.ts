import { shell } from 'electron'
import { XlsxGenerator } from 'electron/abstract'
import { publicCwd } from 'electron/config'
import { GenerateZdoDataXlsx, GenerateZdoXlsx } from 'electron/typing'
import { writeFile } from 'fs'
import moment from 'moment'
import path from 'path'
import { XlsxProductsSummaryConfig } from './interface'
import { ProductsSummarySheetXlsxGenerator } from './products-summary-sheet'

export class ProductsSummaryXlsxGenerator extends XlsxGenerator {
	private workbook: any
	private data: GenerateZdoDataXlsx

	public generate(data: GenerateZdoDataXlsx) {
		this.data = data

		this.createWorkbook()
		this.generateSheets()
		this.writeFile()
	}

	protected createWorkbook() {
		this.workbook = this.XLSX.utils.book_new()
	}

	protected generateSheets() {
		this.data.items.map(it => {
			this.generateSheet(it)
		})
	}

	protected generateSheet(item: GenerateZdoXlsx) {
		const sheetGenerator = new ProductsSummarySheetXlsxGenerator()

		const [name, worksheet] = sheetGenerator.generate(
			item,
			this.data.date,
			this.data,
		)

		this.XLSX.utils.book_append_sheet(this.workbook, worksheet, name)
	}

	protected writeFile() {
		const buf = this.XLSX.write(this.workbook, {
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

		return `Зведена_за_${moment(date).format('MM.YYYY')}.xlsx`
	}
}
