import { GroupCategoryKey } from '@/@types/enums'
import { IProduct } from '@/@types/interfaces'
import { ZdoItem, ZdoTableItem } from '@/@types/interfaces/entities/zdo'
import { useMenus } from '@/modules/menu/hooks'
import { useWarehouseList } from '@/modules/warehouse/hooks'
import { getSumm } from '@/shared/helpers'
import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'

export const useZdo = () => {
	const [groupCategory, setGroupCategory] = useState(GroupCategoryKey.Junior)
	const { items: warehouseItems } = useWarehouseList()

	const filterMenus = (items: any) =>
		items.filter((it: any) => it.groupCategory === groupCategory)

	const { data: menus, date, setDate, resetData } = useMenus({ filterMenus })

	useEffect(() => {
		resetData()
	}, [groupCategory])

	const gerPrice = (id: string) => {
		const item = warehouseItems.find(it => it._id === id)
		return item.price
	}

	const getProductFromMenus = (warehouseId: string) => {
		const result: ZdoTableItem[] = []
		menus.map(it => {
			const toAdd: ZdoTableItem = {
				date: new Date(it.date).getDate(),
				count: 0,
				price: gerPrice(warehouseId),
			}

			it.items.map(it => {
				it.products.map(it2 => {
					if (it2.product?.warehouseId === warehouseId) {
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

		if (_.isEmpty(warehouseItems)) return []

		warehouseItems.map(it => {
			const byDays = getProductFromMenus(it._id)
			const totalCount = getTotalCount(byDays)
			result.push({
				product: {
					_id: it._id,
					price: it.price,
					...it.product,
				},
				byDays: byDays,
				totalCount,
				totalPrice: getSumm(it.price, totalCount),
			})
		})

		return result
	}, [warehouseItems, menus])

	return { items, changeDate: setDate, date, groupCategory, setGroupCategory }
}
