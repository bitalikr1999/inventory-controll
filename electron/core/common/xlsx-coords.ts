export class XlsxCoords {
	private _label: string

	constructor(private _row: number, private _col: number) {
		this.validate()
		this.initLabel()
	}

	public get label() {
		return this._label
	}

	public get row() {
		return this._row
	}

	public get col() {
		return this._col
	}

	protected validate() {
		if (!this.checkValueIsValid(this._row)) throw new Error('Row not valid')
		if (!this.checkValueIsValid(this._col))
			throw new Error('Coll not valid')
	}

	protected checkValueIsValid(val: number) {
		return Number.isInteger(val) && val >= 0
	}

	protected initLabel() {
		this._label = XlsxCoords.coordsToLabel(this._col, this._row)
	}

	protected alphaVal(s: string): number {
		return s.toLowerCase().charCodeAt(0) - 97 + 1
	}

	static coordsToLabel(column: number, row: number) {
		let dividend = column + 1
		let excelCoordinate = ''

		while (dividend > 0) {
			const remainder = (dividend - 1) % 26
			excelCoordinate =
				String.fromCharCode(65 + remainder) + excelCoordinate
			dividend = Math.floor((dividend - 1) / 26)
		}

		excelCoordinate += row + 1
		return excelCoordinate
	}

	static labelToCoords(label: string) {
		const columnLetters = label.match(/[A-Z]+/)[0]
		const rowNumber = parseInt(label.match(/\d+/)[0], 10) - 1

		let column = 0
		for (let i = 0; i < columnLetters.length; i++) {
			const letter = columnLetters[columnLetters.length - 1 - i]
			column += (letter.charCodeAt(0) - 65 + 1) * Math.pow(26, i)
		}

		return [rowNumber, column]
	}

	static fromLabel(label: string) {
		const cords = XlsxCoords.labelToCoords(label)
		return new XlsxCoords(cords[0], cords[1])
	}
}
