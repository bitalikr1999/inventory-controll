import { IProduct } from '@/@types/interfaces'
import { app, shell } from 'electron'
import { dbCwd, groupsLabelsConfig, publicCwd } from 'electron/config'
import { xlsxVal, xlsxValRight, xlsxValСenter } from 'electron/helpers/xlsx'
import { writeFile } from 'fs'
import * as _ from 'lodash'
import moment from 'moment'
import path from 'path'
import { addDishes, addDishesSummary } from './dishes'
import { IMenu, IMenuTableConfig } from './interfaces'
import { writeRows } from './items'
import { generateSummary } from './summary'
const XLSX = require('xlsx-js-style')
import 'moment/locale/uk'

export const generateMenusXlsx = ({ menus }: Params) => {
	const workbook = XLSX.utils.book_new()

	menus.map(menu => {
		try {
			const worksheet = generateMenuList(prepareMenu(menu))
			XLSX.utils.book_append_sheet(
				workbook,
				worksheet,
				`${groupsLabelsConfig[menu.groupCategory]}-${moment(
					new Date(menu.date),
				).format('DD.MM')}`,
			)
		} catch (e) {
			console.log('menu', menu)
			console.log(e)
		}
	})

	const buf = XLSX.write(workbook, {
		type: 'buffer',
		bookType: 'xlsx',
	})

	const date = moment(new Date(menus[0].date))
		.locale('uk')
		.format('MMMM_YYYY')

	const name = `Меньовки_за_${date}.xlsx`

	writeFile(path.join(publicCwd, name), buf, err => {
		console.log('error', err)
		shell.showItemInFolder(path.join(publicCwd, name))
	})
}

const generateMenuList = (menu: IMenu) => {
	const worksheet = XLSX.utils.aoa_to_sheet([])

	const config = getConfig(menu)

	try {
		addHead(worksheet, menu, config)
		addDishes(worksheet, menu.itemsByPeriod, config)
		addDishesSummary(worksheet, menu.itemsByPeriod, config)
		addMerge(worksheet, config)
		writeRows(worksheet, menu.itemsByRows, config)
		generateSummary(worksheet, menu, config)

		worksheet['!cols'] = [
			{ wch: 2 },
			{ wch: 14 },
			{ wch: 14 },
			{ wch: 6 },
			{ wch: 6 },
			{ wch: 10 },
			{ wch: 10 },
			{ wch: 6 },
			{ wch: 6 },
			{ wch: 10 },
			{ wch: 10 },
			{ wch: 6 },
			{ wch: 6 },
		]
		worksheet['!rows'] = [
			{ hpt: 11 },
			{ hpt: 11 },
			{ hpt: 11 },
			{ hpt: 14 },
			{ hpt: 8 },
			{ hpt: 14 },
			{ hpt: 14 },
			{ hpt: 10 },
			{ hpt: 13 },
			{ hpt: 10 },
			{ hpt: 11 },
			{ hpt: 16 },
			{ hpt: 14 },
			{ hpt: 14 },
			{ hpt: 14 },
			{ hpt: 14 },
			{ hpt: 8 },
		]
	} catch (e) {
		console.log('error2', e)
	}

	return worksheet
}

const getConfig = (menu: IMenu) => {
	const periods = menu.itemsByPeriod
	const res: IMenuTableConfig = {
		startHeader: 1,
		maxIndgedientsCount: [0],
		maxDishesCount: _.defaultTo(periods.dinner?.length, 0),
		dishesStartRow: 19,
		rowsConfig: [],
		childrensCount: Number(menu.childrensCount),
	}

	if (periods.dinner?.length > res.maxDishesCount)
		res.maxDishesCount = periods.dinner?.length
	if (periods.supper?.length > res.maxDishesCount)
		res.maxDishesCount = periods.supper?.length

	res.maxDishesCount++

	res.dishesSummaryRow = res.dishesStartRow + res.maxDishesCount + 1

	menu.itemsByRows.map((it, i) => {
		let maxLength = _.max([
			it['m']?.products?.length,
			it['d']?.products?.length,
			it['e']?.products?.length,
		])
		let blockStart = 0

		if (i === 0) {
			blockStart = res.dishesSummaryRow + 1
		} else {
			const prevRow = res.rowsConfig[i - 1]
			blockStart = prevRow.summ2Row + 1
		}

		const start = blockStart + 1
		const end = start + maxLength

		res.rowsConfig[i] = {
			start: blockStart + 1,
			end: end,
			headerRow: blockStart,
			summRow: end,
			summ2Row: end + 2,
		}
	})

	return res
}

const addHead = (worksheet: any, menu: IMenu, config: IMenuTableConfig) => {
	// worksheet['A3'].s = {
	// 	border: {
	// 		top: {
	// 			style: 'thin',
	// 			color: { rgb: '000000' },
	// 		},
	// 	},
	// }
	// worksheet['A4'].s = {
	// 	border: {
	// 		top: {
	// 			style: 'thin',
	// 			color: { rgb: '000000' },
	// 		},
	// 	},
	// }

	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[xlsxVal('Центр розвитку дитини "Пролісок"', false, 9)],
			[xlsxVal('(найменування юридичної особи)', false, 6)],
			[xlsxVal('Ідентифікаційний', false, 9)],
			[
				xlsxVal('код ЄДРПОУ', false, 9),
				,
				,
				xlsxVal('26431648', false, 9),
			],
		],
		{
			origin: 'A4',
			cellStyles: true,
		},
	)

	console.log(worksheet['A4'])

	const date = moment(new Date(menu.date)).format('MM.DD.YYYYр')

	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[xlsxValСenter('ЗАТВЕРДЖУЮ', false, 8)],
			[xlsxValСenter('Директор', false, 8)],
			[xlsxValСenter('(посада)', false, 6)],
			[xlsxValСenter('Аліна МИХАЛЬСЬКА', false, 8)],
			[xlsxValСenter("(підпис ,власне ім'я та ПРІЗВИЩЕ)", false, 6)],
			[xlsxValСenter(date, false, 8)],
		],
		{
			origin: 'H6',
		},
	)

	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[xlsxValСenter('Меню-вимога', false, 12)],
			[xlsxValСenter('на видачу продуктів харчування', false, 11)],
			[xlsxValСenter(date, false, 11)],
		],
		{
			origin: 'A12',
		},
	)

	XLSX.utils.sheet_add_aoa(
		worksheet,
		[[xlsxValСenter('комора', false, 10)]],
		{
			origin: 'J15',
		},
	)

	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[
				xlsxVal(''),
				xlsxVal('Кількість одержувачів харчування', false, 10),
				xlsxVal(''),
				xlsxVal(''),
				xlsxVal(
					`${menu.childrensCount ? menu.childrensCount : ''}`,
					false,
					11,
				),
				xlsxValСenter('Діти віком 1-4 роки', false, 10),
				xlsxVal(''),
				xlsxVal(''),
				xlsxVal(''),
				xlsxValСenter('(місце складання)', false, 7),
			],
		],
		{
			origin: `A16`,
		},
	)

	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[
				xlsxVal('№'),
				xlsxValСenter('Страва'),
				,
				xlsxValСenter('Вихід страви'),
				xlsxValСenter('Ціна страви'),
				xlsxValСenter('Страва'),
				,
				xlsxValСenter('Вихід страви'),
				xlsxValСenter('Ціна страви'),
				xlsxValСenter('Страва'),
				xlsxValСenter(''),
				xlsxValСenter('Вихід страви'),
				xlsxValСenter('Ціна страви'),
			],
		],
		{
			origin: `A18`,
		},
	)

	let startSummary =
		config.rowsConfig[config.rowsConfig.length - 1].summ2Row + 2

	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[
				xlsxVal('Лікар ( дієтсестра)'),
				,
				,
				,
				,
				xlsxValСenter('__________'),
				,
				,
				xlsxValСenter('Світлана ШМІГЕЛЬ'),
			],
			[
				,
				,
				,
				,
				,
				xlsxValСenter('(підпис)', false, 7),
				,
				,
				xlsxValСenter("(власне ім'я таПРІЗВИЩЕ)", false, 7),
			],
			[
				xlsxVal('Прийняв'),
				,
				,
				,
				,
				xlsxValСenter('__________'),
				,
				,
				xlsxValСenter('Наталія БУХАНЦЕВА'),
			],
			[
				,
				,
				,
				,
				,
				xlsxValСenter('(підпис)', false, 7),
				,
				,
				xlsxValСenter("(власне ім'я таПРІЗВИЩЕ)", false, 7),
			],
			[
				xlsxVal('Видав'),
				,
				,
				,
				,
				xlsxValСenter('__________'),
				,
				,
				xlsxValСenter('Юлія ЯЦЕНКО'),
			],
			[
				,
				,
				,
				,
				,
				xlsxValСenter('(підпис)', false, 7),
				,
				,
				xlsxValСenter("(власне ім'я таПРІЗВИЩЕ)", false, 7),
			],
		],
		{
			origin: `A${startSummary + 9}`,
		},
	)
}

const addMerge = (worksheet: any, config: IMenuTableConfig) => {
	const merge = [
		{ s: { r: 0, c: 7 }, e: { r: 0, c: 12 } }, //ЗАТВЕРДЖЕНО
		{ s: { r: 1, c: 7 }, e: { r: 1, c: 12 } }, // Наказ Міністерства фінансів України
		{ s: { r: 2, c: 7 }, e: { r: 2, c: 12 } }, // 13 грудня 2022 року № 431

		{ s: { r: 3, c: 0 }, e: { r: 3, c: 6 } }, // Центр розвитку дитини "Пролісок"
		{ s: { r: 3, c: 7 }, e: { r: 3, c: 12 } },

		{ s: { r: 4, c: 0 }, e: { r: 4, c: 6 } }, // (найменування юридичної особи)
		{ s: { r: 5, c: 0 }, e: { r: 5, c: 6 } }, // Ідентифікаційний
		{ s: { r: 5, c: 7 }, e: { r: 5, c: 12 } }, // ЗАТВЕРДЖУЮ

		{ s: { r: 6, c: 0 }, e: { r: 6, c: 2 } }, // код ЄДРПОУ
		{ s: { r: 6, c: 3 }, e: { r: 6, c: 4 } }, // 26431648

		{ s: { r: 6, c: 7 }, e: { r: 6, c: 12 } }, // Директор
		{ s: { r: 7, c: 7 }, e: { r: 7, c: 12 } }, // (посада)
		{ s: { r: 8, c: 7 }, e: { r: 8, c: 12 } }, // Аліна МИХАЛЬСЬКА
		{ s: { r: 9, c: 7 }, e: { r: 9, c: 12 } }, // (підпис ,власне ім'я та ПРІЗВИЩЕ)
		{ s: { r: 10, c: 7 }, e: { r: 10, c: 12 } }, // дата

		{ s: { r: 11, c: 0 }, e: { r: 11, c: 12 } }, // Меню-вимога
		{ s: { r: 12, c: 0 }, e: { r: 12, c: 12 } }, // на видачу продуктів харчування
		{ s: { r: 13, c: 0 }, e: { r: 13, c: 12 } }, // дата

		{ s: { r: 14, c: 9 }, e: { r: 14, c: 12 } }, // комора

		{ s: { r: 15, c: 1 }, e: { r: 15, c: 3 } }, // Кількість одержувачів харчування
		{ s: { r: 15, c: 5 }, e: { r: 15, c: 8 } }, // Діти віком 1-4 роки
		{ s: { r: 15, c: 9 }, e: { r: 15, c: 12 } }, // (місце складання)

		// { s: { r: 16, c: 1 }, e: { r: 16, c: 4 } },
		// { s: { r: 16, c: 6 }, e: { r: 16, c: 8 } },
		// { s: { r: 16, c: 9 }, e: { r: 16, c: 12 } },

		{ s: { r: 16, c: 0 }, e: { r: 16, c: 12 } },
	]

	for (let index = 17; index <= 18 + config.maxDishesCount; index++) {
		merge.push({
			s: { r: index, c: 1 },
			e: { r: index, c: 2 },
		})
		merge.push({
			s: { r: index, c: 5 },
			e: { r: index, c: 6 },
		})
		merge.push({
			s: { r: index, c: 9 },
			e: { r: index, c: 10 },
		})
	}

	merge.push({
		s: { r: config.dishesSummaryRow - 1, c: 1 },
		e: { r: config.dishesSummaryRow - 1, c: 3 },
	})

	merge.push({
		s: { r: config.dishesSummaryRow - 1, c: 5 },
		e: { r: config.dishesSummaryRow - 1, c: 7 },
	})

	merge.push({
		s: { r: config.dishesSummaryRow - 1, c: 9 },
		e: { r: config.dishesSummaryRow - 1, c: 11 },
	})

	// rows summary
	config.rowsConfig.map(it => {
		merge.push({
			s: { r: it.summRow - 1, c: 1 },
			e: { r: it.summRow - 1, c: 3 },
		})
		merge.push({
			s: { r: it.summ2Row - 1, c: 1 },
			e: { r: it.summ2Row - 1, c: 3 },
		})

		merge.push({
			s: { r: it.summRow - 1, c: 5 },
			e: { r: it.summRow - 1, c: 7 },
		})
		merge.push({
			s: { r: it.summ2Row - 1, c: 5 },
			e: { r: it.summ2Row - 1, c: 7 },
		})

		merge.push({
			s: { r: it.summRow - 1, c: 9 },
			e: { r: it.summRow - 1, c: 11 },
		})
		merge.push({
			s: { r: it.summ2Row - 1, c: 9 },
			e: { r: it.summ2Row - 1, c: 11 },
		})
	})

	let startSummary =
		config.rowsConfig[config.rowsConfig.length - 1].summ2Row + 1

	console.log('startSummary', startSummary)

	for (let index = 0; index < 4; index++) {
		merge.push({
			s: { r: startSummary + index, c: 1 },
			e: { r: startSummary + index, c: 3 },
		})
		merge.push({
			s: { r: startSummary + index, c: 5 },
			e: { r: startSummary + index, c: 7 },
		})
		merge.push({
			s: { r: startSummary + index, c: 9 },
			e: { r: startSummary + index, c: 11 },
		})
	}

	const startFinish = startSummary + 9
	for (let index = 0; index < 6; index++) {
		merge.push(
			...[
				{
					s: { r: startFinish + index, c: 0 },
					e: { r: startFinish + index, c: 4 },
				},
				{
					s: { r: startFinish + index, c: 5 },
					e: { r: startFinish + index, c: 7 },
				},
				{
					s: { r: startFinish + index, c: 8 },
					e: { r: startFinish + index, c: 12 },
				},
			],
		)
	}

	// summary summ
	merge.push({
		s: { r: startSummary + 5, c: 5 },
		e: { r: startSummary + 5, c: 6 },
	})

	merge.push({
		s: { r: startSummary + 6, c: 5 },
		e: { r: startSummary + 6, c: 6 },
	})

	merge.push({
		s: { r: startSummary + 7, c: 5 },
		e: { r: startSummary + 7, c: 6 },
	})

	merge.push({
		s: { r: startSummary + 8, c: 5 },
		e: { r: startSummary + 8, c: 6 },
	})

	worksheet['!merges'] = merge
}

const prepareMenu = (menu: IMenu) => {
	menu.itemsByPeriod = {
		mornin: [],
		dinner: [],
		supper: [],
	}
	menu.itemsByRows = []

	menu.items.map(it => {
		if (!menu.itemsByPeriod[it.period]) menu.itemsByPeriod[it.period] = []
		menu.itemsByPeriod[it.period].push(it)
	})

	if (menu.itemsByPeriod.mornin)
		menu.itemsByPeriod.mornin.map((it, i, arr) => {
			if (!menu.itemsByRows[i]) menu.itemsByRows[i] = {}
			menu.itemsByRows[i]['m'] = it
		})

	if (menu.itemsByPeriod.dinner)
		menu.itemsByPeriod.dinner.map((it, i, arr) => {
			if (!menu.itemsByRows[i]) menu.itemsByRows[i] = {}
			menu.itemsByRows[i]['d'] = it
		})

	if (menu.itemsByPeriod.supper)
		menu.itemsByPeriod.supper.map((it, i, arr) => {
			if (!menu.itemsByRows[i]) menu.itemsByRows[i] = {}
			menu.itemsByRows[i]['e'] = it
		})

	return menu
}

interface Params {
	menus: IMenu[]
}
