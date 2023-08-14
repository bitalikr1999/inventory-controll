import { IMenuItemProduct } from '@/@types/interfaces'
import { IMenuItem } from 'electron/xlsx/menu/interfaces'
import _ from 'lodash'

export const calcDishWeight = (item: IMenuItem) => {
	let weight = 0
	item.products.map(it => {
		weight = weight + Number(it.count)
	})

	return weight.toFixed(2)
}

export const calcDishPrice = (item: Pick<IMenuItem, 'products'>) => {
	let resultPrice = 0

	item.products.map(it => {
		resultPrice = resultPrice + Number(it.product.price) * Number(it.count)
	})

	return resultPrice.toFixed(2)
}

export const calcFreeDishPrice = (item: IMenuItem) => {
	let resultPrice = 0

	item.products.map(it => {
		if (!it.isFree) return
		resultPrice = resultPrice + Number(it.product.price) * Number(it.count)
	})

	return resultPrice.toFixed(2)
}

export const calcProductsSumm = (items: IMenuItem[]) => {
	let result = 0

	items.map(it => {
		const toAdd = calcDishPrice(it)
		if (_.isNumber(toAdd)) result = Number(result) + Number(toAdd)
	})

	return result
}

export const calcProductsPrice = (products: IMenuItemProduct[]) => {
	if (_.isEmpty(products)) return 0
	let resultPrice = 0
	products.map(it => {
		if (!it) return
		resultPrice = resultPrice + Number(it.product.price) * Number(it.count)
	})

	return resultPrice
}

export const calcProductsFreePrice = (products: IMenuItemProduct[]) => {
	if (_.isEmpty(products)) return 0
	let resultPrice = 0
	products.map(it => {
		if (!it || !it.isFree) return
		resultPrice = resultPrice + Number(it.product.price) * Number(it.count)
	})

	return resultPrice
}
