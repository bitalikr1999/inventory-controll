import { calcDishPrice, calcFreeDishPrice } from 'electron/helpers/products'
import { xlsxVal, xlsxValRight, xlsxValСenter } from 'electron/helpers/xlsx'
import { IMenu, IMenuTableConfig } from './interfaces'

const XLSX = require('xlsx-js-style')

export const generateSummary = (
	worksheet: any,
	menu: IMenu,
	config: IMenuTableConfig,
) => {
	const startRow =
		config.rowsConfig[config.rowsConfig.length - 1].summ2Row + 2

	const sum1 = menu.itemsByPeriod.mornin.reduce((res, item) => {
		res = Number(res) + Number(calcDishPrice(item))
		return res
	}, 0)

	const freeSum1 = menu.itemsByPeriod.mornin.reduce((res, item) => {
		res = Number(res) + Number(calcFreeDishPrice(item))
		return res
	}, 0)

	const sum2 = menu.itemsByPeriod.dinner.reduce((res, item) => {
		res = Number(res) + Number(calcDishPrice(item))
		return res
	}, 0)

	const freeSum2 = menu.itemsByPeriod.dinner.reduce((res, item) => {
		res = Number(res) + Number(calcFreeDishPrice(item))
		return res
	}, 0)

	const sum3 = menu.itemsByPeriod.supper.reduce((res, item) => {
		res = Number(res) + Number(calcDishPrice(item))
		return res
	}, 0)

	const freeSum3 = menu.itemsByPeriod.supper.reduce((res, item) => {
		res = Number(res) + Number(calcFreeDishPrice(item))
		return res
	}, 0)

	const summ = Number(Number(sum1) + Number(sum2) + Number(sum3))
	const freeSumm = Number(
		Number(freeSum1) + Number(freeSum2) + Number(freeSum3),
	)
	const nettoSumm = Number(summ - freeSumm)

	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[
				xlsxVal('', false),
				xlsxVal('Сума разом сніданку', false, 10, { bold: true }),
				xlsxVal('', false),
				xlsxVal('', false),
				xlsxValСenter(sum1.toFixed(2), false),
				xlsxVal('Сума разом обіду', false, 10, { bold: true }),
				,
				,
				xlsxValСenter(sum2.toFixed(2), false),
				xlsxVal('Сума разом вечері', false, 10, { bold: true }),
				,
				,
				xlsxValСenter(sum3.toFixed(2), false),
			],
			[
				xlsxVal('', false),
				xlsxVal('За оплатою', false, 10, { bold: true }),
				xlsxVal('', false),
				xlsxVal('', false),
				xlsxValСenter((sum1 - freeSum1).toFixed(2), false),
				xlsxVal('За оплатою', false, 10, { bold: true }),
				,
				,
				xlsxValСenter((sum2 - freeSum2).toFixed(2), false),
				xlsxVal('За оплатою', false, 10, { bold: true }),
				,
				,
				xlsxValСenter((sum3 - freeSum3).toFixed(2), false),
			],
			[
				xlsxVal('', false),
				xlsxVal('Безкоштовно', false, 10, { bold: true }),
				xlsxVal('', false),
				xlsxVal('', false),
				xlsxValСenter(freeSum1.toFixed(2), false),
				xlsxVal('Безкоштовно', false, 10, { bold: true }),
				,
				,
				xlsxValСenter(freeSum2.toFixed(2), false),
				xlsxVal('Безкоштовно', false, 10, { bold: true }),
				,
				,
				xlsxValСenter(freeSum3.toFixed(3), false),
			],
			[
				xlsxVal('', false),
				xlsxVal('На 1 дитину', false, 10, { bold: true }),
				xlsxVal('', false),
				xlsxVal('', false),
				xlsxValСenter(
					Number(
						Number(sum1 - freeSum1) / menu.childrensCount,
					).toFixed(2),
					false,
				),
				xlsxVal('На 1 дитину', false, 10, { bold: true }),
				,
				,
				xlsxValСenter(
					Number(
						Number(sum2 - freeSum2) / menu.childrensCount,
					).toFixed(2),
					false,
				),
				xlsxVal('На 1 дитину', false, 10, { bold: true }),
				,
				,
				xlsxValСenter(
					Number(
						Number(sum3 - freeSum3) / Number(menu.childrensCount),
					).toFixed(2),
					false,
				),
			],
			[],
			[
				,
				,
				,
				,
				,
				xlsxVal('Сума разом', false, 10, { bold: true }),
				,
				,
				xlsxValRight(Number(summ).toFixed(2), false),
			],
			[
				,
				,
				,
				,
				,
				xlsxVal('За оплатою', false, 10, { bold: true }),
				,
				,
				xlsxValRight(Number(nettoSumm).toFixed(2), false),
			],

			[
				,
				,
				,
				,
				,
				xlsxVal('Безкоштовно', false, 10, { bold: true }),
				,
				,
				xlsxValRight(Number(freeSumm).toFixed(2), false),
			],

			[
				,
				,
				,
				,
				,
				xlsxVal('На одну дитину', false, 10, { bold: true }),
				,
				,
				xlsxValRight(
					Number(
						Number(nettoSumm) / Number(menu.childrensCount),
					).toFixed(2),
					false,
				),
			],
		],
		{
			origin: `A${startRow}`,
		},
	)
}
