import * as _ from 'lodash'
import moment from 'moment'

const txtStyle = {
	alignment: { wrapText: true, vertical: 'center' },
	border: {},
}

export const getArrayOfDates = (date: Date) => {
	const result = []
	const month = moment(new Date(date))
	const days = month.daysInMonth()
	for (let index = 0; index < days; index++) {
		result.push(xlsxVal(`${index + 1}.${month.format('MM')}`))
	}
	return result
}

export const xlsxVal = (
	v: any,
	border = true,
	sz = 10,
	fontStyle = {},
	style = {},
) => {
	return {
		v,
		t: 's',
		s: {
			alignment: {
				wrapText: true,
				vertical: 'center',
			},
			// border: border ? txtStyle.border : null,
			font: {
				sz: sz,
				...fontStyle,
			},
			...style,
		},
	}
}

export const xlsxValСenter = (
	v: any,
	border = true,
	sz = 10,
	fontStyle = {},
) => {
	return {
		v,
		t: 's',
		s: {
			alignment: {
				wrapText: true,
				vertical: 'center',
				horizontal: 'center',
			},
			// border: border ? txtStyle.border : null,
			font: {
				sz: sz,
				...fontStyle,
			},
		},
	}
}

export const xlsxValRight = (
	v: any,
	border = true,
	sz = 10,
	fontStyle = {},
	style = {},
) => {
	return {
		v,
		t: 's',
		s: {
			alignment: {
				wrapText: true,
				vertical: 'center',
				horizontal: 'right',
			},
			border: border ? txtStyle.border : null,
			font: {
				sz,
				...fontStyle,
			},
			...style,
		},
	}
}

export const getCellName = (number: number) => {
	switch (number) {
		case 0:
			return 'A'
		case 1:
			return 'B'
		case 2:
			return 'C'
		case 3:
			return 'D'
		case 4:
			return 'E'
		case 5:
			return 'F'
		case 6:
			return 'G'
		case 7:
			return 'H'
		case 8:
			return 'I'
		case 9:
			return 'J'
		case 10:
			return 'K'
		case 11:
			return 'L'
		case 12:
			return 'M'
		case 13:
			return 'N'
		case 14:
			return 'O'
		case 15:
			return 'P'
		case 16:
			return 'Q'
		case 17:
			return 'R'
		case 18:
			return 'S'
		case 19:
			return 'T'
		case 20:
			return 'U'
	}
}

const getColCharName = (row: number, col: number) => {
	return `${getCellName(col)}${row}`
}

export const addBorderToMergeColumn = (
	worksheet: any,
	row: number,
	start: number,
	end: number,
) => {
	const colsCount = end - start + 1
	console.log('cools', colsCount)

	console.log('start', getColCharName(row, start))
	console.log('end', getColCharName(row, end))
	worksheet[getColCharName(row, start)].s = {
		border: {
			top: { style: 'medium', color: { rgb: '000' } },
			left: { style: 'medium', color: { rgb: '000' } },
			bottom: { style: 'medium', color: { rgb: '000' } },
		},
	}

	worksheet[getColCharName(row, end)].s = {
		border: {
			top: { style: 'medium', color: { rgb: '000' } },
			right: { style: 'medium', color: { rgb: '000' } },
			bottom: { style: 'medium', color: { rgb: '000' } },
		},
	}

	const leftCount = colsCount - 2
	if (leftCount > 0) {
		for (let index = 0; index < leftCount; index++) {
			worksheet[getColCharName(row, start + index + 1)].s = {
				border: {
					top: { style: 'medium', color: { rgb: '000' } },
					bottom: { style: 'medium', color: { rgb: '000' } },
				},
			}
		}
	}
}
