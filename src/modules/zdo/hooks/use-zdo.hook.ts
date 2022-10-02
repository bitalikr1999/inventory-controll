import { GroupCategoryKey } from '@/@types/enums'
import { IProduct } from '@/@types/interfaces'
import { ZdoItem, ZdoTableItem } from '@/@types/interfaces/entities/zdo'
import { useMenus } from '@/modules/menu/hooks'
import { getSumm } from '@/shared/helpers'
import { useStoreDate } from '@/shared/hooks'
import _ from 'lodash'
import { useMemo, useState } from 'react'

export const useZdo = () => {
	const filterMenus = (items: any) =>
		items.filter((it: any) => it.groupCategory === GroupCategoryKey.Middle)

	const { data: menus, date, setDate } = useMenus({ filterMenus })
	const { data: products } = useStoreDate<IProduct[]>({
		store: 'products',
		field: 'list',
	})

	const gerPrice = (productId: number) => {
		const item = products.find(it => it.id === productId)
		return item.price
	}

	const getProductFromMenus = (productId: number) => {
		const result: ZdoTableItem[] = []
		menus.map(it => {
			const toAdd: ZdoTableItem = {
				date: new Date(it.date).getDate(),
				count: 0,
				price: gerPrice(productId),
			}

			it.items.map(it => {
				it.products.map(it2 => {
					if (it2.product?.id === productId) {
						toAdd.count = Number(toAdd.count) + Number(it2.count)
					}
				})
			})

			result.push(toAdd)
		})
		return result
	}

	const getTotalCount = (items: ZdoTableItem[]) => {
		let count = 0

		items.map(it => {
			count = Number(count) + Number(it.count)
		})

		return count
	}

	const items = useMemo(() => {
		const result: ZdoItem[] = []
		if (_.isEmpty(products) || _.isEmpty(menus)) return []

		products.map(it => {
			const byDays = getProductFromMenus(it.id)
			const totalCount = getTotalCount(byDays)
			result.push({
				product: it,
				byDays: byDays,
				totalCount,
				totalPrice: getSumm(it.price, totalCount),
			})
		})

		return result
	}, [products, menus])

	return { items, changeDate: setDate, date }
}
