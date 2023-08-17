import { XlsxProductsSummaryConfig } from '../interface'

export const generateMerge = (config: XlsxProductsSummaryConfig) => {
	const sth = config.startHead[1]

	const merge = [
		{ s: { r: sth, c: 0 }, e: { r: sth, c: 3 } }, //Центр розвитку дитини "Пролісок"
		{ s: { r: sth + 1, c: 0 }, e: { r: sth + 1, c: 3 } }, //(найменування юридичної особи)
		{ s: { r: sth + 2, c: 0 }, e: { r: sth + 2, c: 3 } }, // Ідентифікаційний
		{ s: { r: sth + 3, c: 0 }, e: { r: sth + 3, c: 1 } }, // код ЄДРПОУ
		{ s: { r: sth + 3, c: 2 }, e: { r: sth + 3, c: 3 } }, // код ЄДРПОУ val
	]

	// titles
	for (let index = 0; index < 3; index++) {
		merge.push({
			s: {
				r: config.startTitle[1] + index,
				c: config.startTitle[0],
			},
			e: {
				r: config.startTitle[1] + index,
				c: config.startTitle[0] + 10,
			},
		})
	}

	// responsible person

	merge.push(
		{
			s: { r: config.startResponsiblePerson, c: 0 },
			e: { r: config.startResponsiblePerson, c: 3 },
		},
		{
			s: { r: config.startResponsiblePerson, c: 4 },
			e: { r: config.startResponsiblePerson, c: 6 },
		},
		{
			s: { r: config.startResponsiblePerson + 1, c: 4 },
			e: { r: config.startResponsiblePerson + 1, c: 6 },
		},
	)

	// table head

	const str = Number(config.startTableRow)

	console.log({ s: { r: str, c: 0 }, e: { r: str + 2, c: 1 } })

	merge.push(
		{ s: { r: str, c: 0 }, e: { r: str + 2, c: 1 } }, // name
		{ s: { r: str, c: 2 }, e: { r: str + 2, c: 2 } }, // unit

		{ s: { r: str, c: 3 }, e: { r: str, c: 5 } }, // month count
		{ s: { r: str + 1, c: 3 }, e: { r: str + 1, c: 4 } }, // users count

		{
			s: { r: str + 2, c: 6 },
			e: { r: str + 2, c: 6 + config.daysInMonthCount },
		}, // users count
	)

	// tabel names
	for (
		let index = config.startTableItemsRow;
		index <= config.endTableRow;
		index++
	) {
		merge.push({
			s: {
				r: index,
				c: 0,
			},
			e: {
				r: index,
				c: 1,
			},
		})
	}

	return merge
}
