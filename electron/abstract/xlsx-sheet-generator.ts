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
}
