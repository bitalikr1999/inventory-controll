import { app } from 'electron'
import { dbCwd, publicCwd } from 'electron/config'
import { NumberToXlsxChar } from 'electron/helpers/number'
import { getArrayOfDates, xlsxVal } from 'electron/helpers/xlsx'
import { writeFile } from 'fs'
import * as _ from 'lodash'
import moment from 'moment'
import path from 'path'
const XLSX = require('xlsx-js-style')
const { shell } = require('electron')

const AlphanumericEncoder = require('alphanumeric-encoder')
const encoder = new AlphanumericEncoder()

export const generateZdoXlsx = ({ items }: GenerateZdoXlsx) => {
	const workbook = XLSX.utils.book_new()
	const worksheet = XLSX.utils.aoa_to_sheet([])
	const config = calcConfig(items, new Date())

	addMerge(config, worksheet)
	addWidth(config, worksheet)
	addHeader(config, items, worksheet)
	addTitles(
		config,
		'Зведена відомість продутів, які використані для харчування вихованців  віком 1-4 р.ЦРД " Пролісок" за січень 2022р',
		worksheet,
	)
	addItems(config, items, worksheet)
	addSumm(config, items, worksheet)
	addHeight(worksheet)

	worksheet['!rows'] = [
		{ hpt: 10 },
		{ hpt: 10 },
		{ htp: 30 },
		{ htp: 30 },
		{ htp: 35 },
		{ htp: 35 },
	]

	finish(workbook, worksheet, 'zdo')
}

const addHeader = (config: Config, items: ZdoItem[], worksheet: any) => {
	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[
				xlsxVal('№ п/п'),
				xlsxVal('Назва продукту'),
				xlsxVal('Од. вим'),
				...getArrayOfDates(new Date()),
				xlsxVal('Разом'),
				xlsxVal('Ціна,кг'),
				xlsxVal('Сума,грн'),
			],
		],
		{ origin: 'A6' },
	)
}

const addTitles = (config: Config, title: string, worksheet: any) => {
	const item = (v: string) => {
		return [
			{
				v: v,
				t: 's',
				s: {
					alignment: {
						wrapText: true,
						vertical: 'center',
						horizontal: 'right',
					},
				},
			},
		]
	}
	XLSX.utils.sheet_add_aoa(worksheet, [item('Затверджую')], {
		origin: `${encoder.encode(config.endTableCol - 4)}3`,
	})
	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			item('Директор ЦРД " Пролісок"               Аліна Михальська'),
			item(title),
		],
		{ origin: 'A4' },
	)
}

const addSumm = (config: Config, items: ZdoItem[], worksheet: any) => {
	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			['З оплатою', , , , '100грн'],
			['Безкоштовно', , , , '0'],
			['Разом', , , , '100грн'],
		],
		{
			origin: config.summColChar,
		},
	)
}

const addItems = (config: Config, items: ZdoItem[], worksheet: any) => {
	const renderItems = items.map((it, i) => {
		const getDayIt = (day: number): any => {
			const result = it.byDays.find(it => it.date === day)
			return _.defaultTo(result, { price: 0 })
		}

		const byDays = Array.from({ length: config.daysInMonth }, (_, i) => {
			return xlsxVal(getDayIt(i).price)
		})

		return [
			xlsxVal(i),
			xlsxVal(it.product.name),
			xlsxVal(it.product.measurmentUnit),
			...byDays,
			xlsxVal(it.totalCount),
			xlsxVal(it.product.price),
			xlsxVal(it.totalPrice),
		]
	})
	XLSX.utils.sheet_add_aoa(worksheet, [...renderItems], { origin: 'A7' })
}

const addMerge = (config: Config, worksheet: any) => {
	const merge = [
		{ s: { r: 3, c: 0 }, e: { r: 3, c: config.endTableCol } },
		{ s: { r: 4, c: 0 }, e: { r: 4, c: config.endTableCol } },
		{
			s: { r: 2, c: config.endTableCol - 5 },
			e: { r: 2, c: config.endTableCol - 2 },
		},
		{
			s: { r: config.endProductRow, c: config.endProductCol - 3 },
			e: { r: config.endProductRow, c: config.endProductCol - 1 },
		},
		{
			s: { r: config.endProductRow + 1, c: config.endProductCol - 3 },
			e: { r: config.endProductRow + 1, c: config.endProductCol - 1 },
		},
		{
			s: { r: config.endProductRow + 2, c: config.endProductCol - 3 },
			e: { r: config.endProductRow + 2, c: config.endProductCol - 1 },
		},
	]
	worksheet['!merges'] = merge
}

const addWidth = (config: Config, worksheet: any) => {
	const colsW = [{ wch: 3 }, { wch: 20 }, { wch: 4 }]

	for (let index = 0; index < config.daysInMonth; index++) {
		colsW.push({ wch: 5 })
	}

	colsW.push({ wch: 7 }, { wch: 7 }, { wch: 8 })
	worksheet['!cols'] = colsW
}

const addHeight = (worksheet: any) => {
	const rowsH = []
	for (let index = 0; index < 50; index++) {
		rowsH.push({ hpx: 20 })
	}
	worksheet['!rows'] = rowsH
}

const finish = (workbook: any, worksheet: any, title: string) => {
	XLSX.utils.book_append_sheet(workbook, worksheet, 'ЗДО')

	const buf = XLSX.write(workbook, {
		type: 'buffer',
		bookType: 'xlsx',
	})

	writeFile(path.join(publicCwd, `${title}.xlsx`), buf, err => {
		console.log('error', err)
		shell.showItemInFolder(path.join(publicCwd, `${title}.xlsx`))
	})
}

const calcConfig = (items: ZdoItem[], date: any) => {
	const result = {
		daysInMonth: moment(new Date(date)).daysInMonth(),
		startProductRow: 6,
		startProductCol: 4,
		endProductRow: 0,
		endProductCol: 0,
		summColChar: '',
		endTableCol: 0,
	}

	result.endProductRow = result.startProductRow + items.length
	result.endProductCol = result.startProductCol + result.daysInMonth
	result.summColChar = `${encoder.encode(result.endProductCol - 2)}${
		result.endProductRow + 1
	}`
	result.endTableCol = result.endProductCol + 1

	return result
}

export interface GenerateZdoXlsx {
	items: ZdoItem[]
	setting: {
		name: string
		edrpoy: string
		daysInMonthCount: number
		director: string
		storekeeper: string
		title: string
		subtitle: string
		date: string
	}
}

export interface ZdoItem {
	product: IProduct
	byDays: ZdoTableItem[]
	numberOfRecipients: number

	totalCount: number
	totalPrice: number
}

export interface ZdoTableItem {
	date: number
	count: number
	price: number
}

export interface IProduct {
	id: number
	name: string
	price: number
	measurmentUnit: any
	createdAt: string
}

interface Config {
	daysInMonth: number
	startProductRow: number
	startProductCol: number
	endProductRow: number
	endProductCol: number
	summColChar: string
	endTableCol: number
}
