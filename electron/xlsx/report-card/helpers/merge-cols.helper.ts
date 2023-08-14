import { XlsxReportCardConfig } from '../interfaces'

export const generateMerge = (config: XlsxReportCardConfig) => {
	const merge = [
		{ s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, //Центр розвитку дитини "Пролісок"
		{ s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, //(найменування юридичної особи)
		{ s: { r: 3, c: 0 }, e: { r: 3, c: 3 } }, // Ідентифікаційний
		{ s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }, // код ЄДРПОУ
		{ s: { r: 4, c: 2 }, e: { r: 4, c: 3 } }, // код ЄДРПОУ val
	]

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

	for (
		let index = config.startTableRow;
		index <= config.endTableRow;
		index++
	) {
		merge.push({
			s: {
				r: index,
				c: 1,
			},
			e: {
				r: index,
				c: 3,
			},
		})
	}

	for (let index = 0; index < 2; index++) {
		merge.push({
			s: {
				r: config.startFooterRow + index,
				c: 2,
			},
			e: {
				r: config.startFooterRow + index,
				c: 5,
			},
		})
		merge.push({
			s: {
				r: config.startFooterRow + index,
				c: 9,
			},
			e: {
				r: config.startFooterRow + index,
				c: 14,
			},
		})
	}

	return merge
}
