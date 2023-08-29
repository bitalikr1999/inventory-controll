import React, { useEffect, useMemo, useState } from 'react'
import { HistoryPageTemplate } from '@/modules/history/templates'
import { useLocationState } from '@/shared/hooks'
import { IHistoryRecord } from '@/modules/history/typing'
import { prepareItems } from './transform-to-history-items'
import { warehouseHistoryAPI } from '../../api'

export const WarehouseHistory = () => {
	const [warehouseItemId] = useLocationState(extractIdFromState)
	const [items, setItems] = useState<IHistoryRecord[]>([])

	function extractIdFromState(state: any) {
		return state?.id as number
	}

	const load = async () => {
		const data = await warehouseHistoryAPI.getAll()
		setItems(prepareItems(data))
	}

	useEffect(() => {
		load()
	}, [])

	const title = useMemo(() => {
		return 'Історія складу'
	}, [])

	return <HistoryPageTemplate title={title} records={items} />
}
