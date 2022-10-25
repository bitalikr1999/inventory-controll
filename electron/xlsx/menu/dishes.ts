import { calcDishPrice, calcDishWeight } from 'electron/helpers/products'
import {
	addBorderToMergeColumn,
	xlsxVal,
	xlsxValRight,
	xlsxValСenter,
} from 'electron/helpers/xlsx'
import { IMenu, IMenuTableConfig } from './interfaces'
const XLSX = require('xlsx-js-style')

export const addDishes = (
	worksheet: any,
	periods: IMenu['itemsByPeriod'],
	config: IMenuTableConfig,
) => {
	for (let index = 0; index < config.maxDishesCount; index++) {
		const values: any = [xlsxVal(index + 1, false)]
		;[
			periods.mornin[index],
			periods.dinner[index],
			periods.supper[index],
		].map(it => {
			if (it) {
				values.push(
					xlsxVal(it.name, false),
					null,
					xlsxVal(calcDishWeight(it), false),
					xlsxVal(calcDishPrice(it), false),
				)
			} else {
				values.push(xlsxVal(''), xlsxVal(''), xlsxVal(''), xlsxVal(''))
			}
		})

		XLSX.utils.sheet_add_aoa(worksheet, [values], {
			origin: `A${config.dishesStartRow + index}`,
		})
	}
}

export const addDishesSummary = (
	worksheet: any,
	periods: IMenu['itemsByPeriod'],
	config: IMenuTableConfig,
) => {
	const sum1 = periods.mornin.reduce((res, item) => {
		res = Number(res) + Number(calcDishPrice(item))
		return res
	}, 0)

	const sum2 = periods.dinner.reduce((res, item) => {
		res = Number(res) + Number(calcDishPrice(item))
		return res
	}, 0)

	const sum3 = periods.supper.reduce((res, item) => {
		res = Number(res) + Number(calcDishPrice(item))
		return res
	}, 0)

	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[
				xlsxVal('', false),
				xlsxValRight('Вартість сніданку', false),
				xlsxVal('', false),
				xlsxVal('', false),
				xlsxValСenter(sum1.toFixed(2), false),
				xlsxValRight('Вартість обіду', false),
				,
				,
				xlsxValСenter(sum2.toFixed(2), false),
				xlsxValRight('Вартість вечері', false),
				,
				,
				xlsxValСenter(sum3.toFixed(2), false),
			],
		],
		{
			origin: `A${config.dishesSummaryRow}`,
		},
	)
}
