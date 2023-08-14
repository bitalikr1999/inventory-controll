import { XlsxCoords } from 'electron/typing'
const XLSX = require('xlsx-js-style')

export abstract class XlsxGenerator {
	protected XLSX = XLSX

	protected transformToCords(string: string): XlsxCoords {
		const rowString = string.split('')[0]
		const col = Number(string.substring(1))

		return [this.alphaVal(rowString) - 1, col - 1]
	}

	protected transformFromCords(cords: XlsxCoords): string {
		return `${String.fromCharCode(cords[0] + 65)}${cords[1] + 1}`
	}

	protected alphaVal(s: string): number {
		return s.toLowerCase().charCodeAt(0) - 97 + 1
	}
}
