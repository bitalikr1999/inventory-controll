import { IProduct } from '@/@types/interfaces'
import {
	useAPICalEventsListener,
	useMultyHookState,
	useStoreDate,
} from '@/shared/hooks'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { productsAPI } from '../api'

export const useProducts = (autoInit = true) => {
	const [items, setItems] = useMultyHookState<IProduct[]>('products', [])
	const [isLoading, setLoading] = useState(false)

	const load = async () => {
		try {
			setLoading(true)
			const data = await productsAPI.getAll()
			setItems(data)
		} catch (e) {
		} finally {
			setLoading(false)
		}
	}

	useAPICalEventsListener('products/delete', () => {
		console.log('onproductsdelete')
		load()
	})
	useAPICalEventsListener('products/add', () => {
		console.log('onproductsdelete')
		load()
	})
	useAPICalEventsListener('products/update', () => {
		console.log('onproductsdelete')
		load()
	})

	useEffect(() => {
		if (autoInit) load()
	}, [autoInit])

	return {
		items,
		load,
		isLoading,
	}
}
