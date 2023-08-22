import { XlsxCoords } from 'electron/typing'
const XLSX = require('xlsx-js-style')

export abstract class XlsxGenerator {
	protected XLSX = XLSX

	protected transformToCords(excelCoordinate: string): XlsxCoords {
		const columnLetters = excelCoordinate.match(/[A-Z]+/)[0]
		const rowNumber = parseInt(excelCoordinate.match(/\d+/)[0], 10) - 1

		let column = 0
		for (let i = 0; i < columnLetters.length; i++) {
			const letter = columnLetters[columnLetters.length - 1 - i]
			column += (letter.charCodeAt(0) - 65 + 1) * Math.pow(26, i)
		}

		return [rowNumber, column]
	}

	protected transformFromCords(cords: XlsxCoords): string {
		const column = cords[0]
		const row = cords[1]
		let dividend = column + 1
		let excelCoordinate = ''

		while (dividend > 0) {
			const remainder = (dividend - 1) % 26
			excelCoordinate =
				String.fromCharCode(65 + remainder) + excelCoordinate
			dividend = Math.floor((dividend - 1) / 26)
		}

		excelCoordinate += row + 1 // Додаємо номер рядка

		return excelCoordinate
	}

	protected alphaVal(s: string): number {
		return s.toLowerCase().charCodeAt(0) - 97 + 1
	}
}
