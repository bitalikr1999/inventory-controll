import { IWarehouseItem } from '@/@types/interfaces'
import { useProducts } from '@/modules/products/hooks'
import _ from 'lodash'
import { useEffect, useState } from 'react'

export const useWarehouseList = () => {
	const [items, setItems] = useState<IWarehouseItem[]>([])
	const products = useProducts()

	const loadItems = async () => {
		const data = await window.Main.emit('getWarehouseItems', {})
		setItems(data.map(fillItem))
	}

	const fillItem = (item: IWarehouseItem) => {
		return {
			...item,
			product: products.items.find(it => it.id === item.productId),
		}
	}

	useEffect(() => {
		if (!_.isEmpty(products.items)) loadItems()
	}, [products.items])

	const remove = async (id: string) => {
		await window.Main.emit('deleteWarehouseItem', { id })
		loadItems()
	}

	return {
		items,
		remove,
		reload: loadItems,
	}
}
