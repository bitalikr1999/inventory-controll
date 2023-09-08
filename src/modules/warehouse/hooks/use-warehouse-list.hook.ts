import { useEffect, useState } from 'react'
import _ from 'lodash'

import { IWarehouseItem } from '@/@types/interfaces'
import { useProducts } from '@/modules/products/hooks'

import { warehouseAPI } from '../api/warehouse.api'

export const useWarehouseList = () => {
	const [items, setItems] = useState<IWarehouseItem[]>([])
	const products = useProducts(true)

	const loadItems = async () => {
		const data = await warehouseAPI.get()
		setItems(data.map(fillItem))
	}

	const fillItem = (item: IWarehouseItem) => {
		return {
			...item,
			product: products.items.find(it => it._id === item.productId),
		}
	}

	useEffect(() => {
		if (!_.isEmpty(products.items)) loadItems()
	}, [products.items])

	const remove = async (id: string) => {
		await warehouseAPI.delete(id)
		loadItems()
	}

	return {
		items,
		remove,
		reload: loadItems,
	}
}
