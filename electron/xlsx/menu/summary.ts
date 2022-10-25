import { calcDishPrice } from 'electron/helpers/products'
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

	const sum2 = menu.itemsByPeriod.dinner.reduce((res, item) => {
		res = Number(res) + Number(calcDishPrice(item))
		return res
	}, 0)

	const sum3 = menu.itemsByPeriod.supper.reduce((res, item) => {
		res = Number(res) + Number(calcDishPrice(item))
		return res
	}, 0)

	const summ = Number(Number(sum1) + Number(sum2) + Number(sum3))
	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[
				xlsxVal('', false),
				xlsxVal('Сума разом сніданку', false),
				xlsxVal('', false),
				xlsxVal('', false),
				xlsxValСenter(sum1.toFixed(2), false),
				xlsxVal('Сума разом обіду', false),
				,
				,
				xlsxValСenter(sum2.toFixed(2), false),
				xlsxVal('Сума разом вечері', false),
				,
				,
				xlsxValСenter(sum3.toFixed(2), false),
			],
			[
				xlsxVal('', false),
				xlsxVal('За оплатою', false),
				xlsxVal('', false),
				xlsxVal('', false),
				xlsxValСenter(sum1.toFixed(2), false),
				xlsxVal('За оплатою', false),
				,
				,
				xlsxValСenter(sum2.toFixed(2), false),
				xlsxVal('За оплатою', false),
				,
				,
				xlsxValСenter(sum3.toFixed(2), false),
			],
			[
				xlsxVal('', false),
				xlsxVal('Безкоштовно', false),
				xlsxVal('', false),
				xlsxVal('', false),
				xlsxValСenter('', false),
				xlsxVal('Безкоштовно', false),
				,
				,
				xlsxValСenter('', false),
				xlsxValRight('Безкоштовно', false),
				,
				,
				xlsxValСenter('', false),
			],
			[
				xlsxVal('', false),
				xlsxVal('На 1 дитину', false),
				xlsxVal('', false),
				xlsxVal('', false),
				xlsxValСenter(
					Number(Number(sum1) / menu.childrensCount).toFixed(2),
					false,
				),
				xlsxVal('На 1 дитину', false),
				,
				,
				xlsxValСenter(
					Number(Number(sum2) / menu.childrensCount).toFixed(2),
					false,
				),
				xlsxVal('На 1 дитину', false),
				,
				,
				xlsxValСenter(
					Number(Number(sum3) / Number(menu.childrensCount)).toFixed(
						2,
					),
					false,
				),
			],
			[, , , , , , xlsxValRight(Number(summ).toFixed(2), false)],
			[
				,
				,
				,
				,
				,
				,
				xlsxValRight(
					Number(Number(summ) / Number(menu.childrensCount)).toFixed(
						2,
					),
					false,
				),
			],
			[],
			[
				,
				xlsxVal('Комірник      Ю.Яценко', false),
				,
				,
				,
				xlsxVal('Повар', false),
				,
				,
				,
				xlsxVal('Медсестра      С.Шмігель ', false),
			],
		],
		{
			origin: `A${startRow}`,
		},
	)
}
