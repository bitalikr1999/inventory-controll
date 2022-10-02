import { IProduct } from '@/@types/interfaces'
import { app, shell } from 'electron'
import { dbCwd, publicCwd } from 'electron/config'
import { xlsxVal, xlsxValСenter } from 'electron/helpers/xlsx'
import { writeFile } from 'fs'
import * as _ from 'lodash'
import moment from 'moment'
import path from 'path'
import { addDishes, addDishesSummary } from './dishes'
import { IMenu, IMenuTableConfig } from './interfaces'
const XLSX = require('xlsx-js-style')

export const generateMenusXlsx = ({ menus }: Params) => {
	const workbook = XLSX.utils.book_new()

	const menu = prepareMenu(menus[0])
	const worksheet = generateMenuList(menu)
	XLSX.utils.book_append_sheet(workbook, worksheet, `test`)

	const buf = XLSX.write(workbook, {
		type: 'buffer',
		bookType: 'xlsx',
	})

	writeFile(path.join(publicCwd, `test2.xlsx`), buf, err => {
		console.log('error', err)
		shell.showItemInFolder(path.join(publicCwd, `test2.xlsx`))
	})
}

const generateMenuList = (menu: IMenu) => {
	const worksheet = XLSX.utils.aoa_to_sheet([])

	const config = getConfig(menu)

	try {
		addHead(worksheet, menu)
		addDishes(worksheet, menu.itemsByPeriod, config)
		addDishesSummary(worksheet, menu.itemsByPeriod, config)
		addMerge(worksheet, config)
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
		dishesStartRow: 4,
	}

	if (periods.dinner?.length > res.maxDishesCount)
		res.maxDishesCount = periods.dinner?.length
	if (periods.supper?.length > res.maxDishesCount)
		res.maxDishesCount = periods.supper?.length

	res.dishesSummaryRow = res.dishesStartRow + res.maxDishesCount + 1

	return res
}

const addHead = (worksheet: any, menu: IMenu) => {
	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[
				xlsxValСenter('Меню вимога їдальні ЦРД " Пролісок"', false),
				,
				,
				,
				,
				,
				xlsxValСenter('Діти віком  1-4 роки', false),
			],
		],
		{
			origin: 'A1',
		},
	)
	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[
				xlsxVal(''),
				xlsxVal('Дата'),
				xlsxVal(''),
				xlsxVal(moment(new Date(menu.date)).format('MM.DD.YYYYр')),
				xlsxVal(''),
				xlsxVal('Кількість  дітей'),
				xlsxVal(''),
				xlsxVal(''),
				xlsxVal(''),
				xlsxVal(`${menu.childrensCount ? menu.childrensCount : ''}`),
				xlsxVal(''),
				xlsxVal(''),
				xlsxVal(''),
				xlsxVal(''),
			],
		],
		{
			origin: `A2`,
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
				xlsxValСenter('Страва'),
			],
		],
		{
			origin: `A3`,
		},
	)
}

const addMerge = (worksheet: any, config: IMenuTableConfig) => {
	const merge = [
		{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
		{ s: { r: 0, c: 6 }, e: { r: 0, c: 10 } },
		{ s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },
		{ s: { r: 1, c: 3 }, e: { r: 1, c: 4 } },
		{ s: { r: 1, c: 5 }, e: { r: 1, c: 8 } },
		{ s: { r: 1, c: 9 }, e: { r: 1, c: 12 } },
	]

	for (let index = 2; index <= 3 + config.maxDishesCount; index++) {
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

	worksheet['!merges'] = merge
}

const prepareMenu = (menu: IMenu) => {
	menu.itemsByPeriod = {
		dinner: [],
		mornin: [],
		supper: [],
	}
	menu.itemsByRows = [[], [], []]

	menu.items.map(it => {
		if (!menu.itemsByPeriod[it.period]) menu.itemsByPeriod[it.period] = []
		menu.itemsByPeriod[it.period].push(it)
	})

	if (menu.itemsByPeriod.mornin)
		menu.itemsByPeriod.mornin.map((it, i, arr) => {
			if (!menu.itemsByRows[i]) menu.itemsByRows[i] = []
			else menu.itemsByRows[i].push(it)
		})

	if (menu.itemsByPeriod.dinner)
		menu.itemsByPeriod.dinner.map((it, i, arr) => {
			if (!menu.itemsByRows[i]) menu.itemsByRows[i] = []
			else menu.itemsByRows[i].push(it)
		})

	if (menu.itemsByPeriod.supper)
		menu.itemsByPeriod.supper.map((it, i, arr) => {
			if (!menu.itemsByRows[i]) menu.itemsByRows[i] = []
			else menu.itemsByRows[i].push(it)
		})

	return menu
}

interface Params {
	menus: IMenu[]
}
