import { IProduct } from '@/@types/interfaces'
import { useStoreDate } from '@/shared/hooks'
import _ from 'lodash'

export const useProducts = () => {
	const { data: items, set } = useStoreDate<IProduct[]>({
		store: 'products',
		field: 'list',
		serrialization: (items: IProduct[]) => {
			return items ? items.sort((a, b) => a.id - b.id) : []
		},
	})

	const getLastId = () => {
		if (_.isEmpty(items)) return 0
		const id = Number(items[items.length - 1].id)
		return _.defaultTo(id, 0)
	}

	return {
		items,
		set,
		getLastId,
	}
}
