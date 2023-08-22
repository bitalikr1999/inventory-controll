import { GenerateZdoDataXlsx, GenerateZdoXlsx } from 'electron/typing'

export const calcSizes = (
	data: GenerateZdoXlsx,
	settings: GenerateZdoDataXlsx,
) => {
	const colsSizes = [
		{ wpx: 24 },
		{ wpx: 159 },
		{ wpx: 45 },
		{ wpx: 75 },
		{ wpx: 93 },
		{ wpx: 88 },
	]

	for (let index = 0; index < settings.daysInMonthCount + 1; index++) {
		colsSizes.push({ wpx: 52 })
	}

	const rows = [
		{ hpt: 17 },
		{ hpt: 14 },
		{ hpt: 12 },
		{ hpt: 19 },
		{ hpt: 19 },
		{ hpt: 19 },
		{ hpt: 16 },
		{ hpt: 22 },
		{ hpt: 14 },

		{ hpt: 14 }, //title
		{ hpt: 14 }, //title
		{ hpt: 22 }, //title
		{ hpt: 15 }, //title space

		{ hpt: 21 },
		{ hpt: 24 },
		{ hpt: 38 },
	]

	const itemsCount = data.items.length + 4

	for (let index = 0; index < itemsCount; index++) {
		rows.push({ hpt: 24 })
	}

	rows.push({ hpt: 14 }, { hpt: 20 }, { hpt: 20 }, { hpt: 16 }, { hpt: 24 })

	return {
		cols: colsSizes,
		rows,
	}
}
