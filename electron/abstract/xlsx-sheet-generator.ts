import { XlsxGenerator } from './xlsx-generator'

export abstract class XlsxSheetGenerator extends XlsxGenerator {
	protected worksheet: any

	protected initWorksheet() {
		this.worksheet = this.XLSX.utils.aoa_to_sheet([])
	}

	protected writeData(origin: string, data: any) {
		this.XLSX.utils.sheet_add_aoa(this.worksheet, data, {
			origin,
		})
	}

	protected prepareNumberVal(number: number | string) {
		if (!number) return ''
		if (number === 0) return ''

		return Number(number).toLocaleString('ru-RU', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 3,
		})
	}
}
