import { calcProductsPrice } from 'electron/helpers/products'
import { xlsxVal, xlsxValСenter } from 'electron/helpers/xlsx'
import {
	IItemsRow,
	IMenu,
	IMenuItem,
	IMenuTableConfig,
	IRowConfig,
} from './interfaces'
const XLSX = require('xlsx-js-style')

export const writeRows = (
	worksheet: any,
	rows: IMenu['itemsByRows'],
	config: IMenuTableConfig,
) => {
	rows.map((item, index) => {
		writeRow(
			worksheet,
			item,
			config.rowsConfig[index],
			index === 0,
			config.childrensCount,
		)
	})
}

export const writeRow = (
	worksheet: any,
	row: IItemsRow,
	config: IRowConfig,
	header: boolean,
	childrensCount: number,
) => {
	if (header)
		XLSX.utils.sheet_add_aoa(
			worksheet,
			[
				[
					xlsxVal('', false),
					xlsxValСenter('Продукти', false),
					xlsxValСenter('К-сть', false),
					xlsxValСenter('Ціна', false),
					xlsxValСenter('Сума', false),
					xlsxValСenter('Продукти', false),
					xlsxValСenter('К-сть', false),
					xlsxValСenter('Ціна', false),
					xlsxValСenter('Сума', false),
					xlsxValСenter('Продукти', false),
					xlsxValСenter('К-сть', false),
					xlsxValСenter('Ціна', false),
					xlsxValСenter('Сума', false),
				],
			],
			{
				origin: `A${config.headerRow}`,
			},
		)

	renderBlock(worksheet, row.m, `B${config.start}`)
	renderBlock(worksheet, row.d, `F${config.start}`)
	renderBlock(worksheet, row.e, `J${config.start}`)

	const summMorning = calcProductsPrice(row.m?.products)
	const summDinner = calcProductsPrice(row.d?.products)
	const summSupper = calcProductsPrice(row.e?.products)

	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[
				xlsxVal('', false),
				xlsxVal('Разом за оплатою', false),
				,
				,
				xlsxValСenter(summMorning.toFixed(2)),
				xlsxVal('Разом за оплатою', false),
				,
				,
				xlsxValСenter(summDinner.toFixed(2)),
				xlsxVal('Разом за оплатою', false),
				,
				,
				xlsxValСenter(summSupper.toFixed(2)),
			],
			[
				xlsxVal('', false),
				xlsxVal('На 1 дитину', false),
				,
				,
				xlsxValСenter(Number(summMorning / childrensCount).toFixed(2)),
				xlsxVal('На 1 дитину', false),
				,
				,
				xlsxValСenter(Number(summDinner / childrensCount).toFixed(2)),
				xlsxVal('На 1 дитину', false),
				,
				,
				xlsxValСenter(Number(summSupper / childrensCount).toFixed(2)),
			],
		],
		{
			origin: `A${config.summRow}`,
		},
	)
}

const renderBlock = (worksheet: any, block: IMenuItem, origin: string) => {
	if (!block) return
	const toPush: any[][] = []

	block.products.map(it => {
		const product = it.product
		toPush.push([
			xlsxVal(product.name, false),
			xlsxValСenter(it.count, false),
			xlsxValСenter(product.price, false),
			xlsxValСenter(
				Number(product.price * Number(it.count)).toFixed(2),
				false,
			),
		])
	})

	XLSX.utils.sheet_add_aoa(worksheet, toPush, {
		origin,
	})
}
