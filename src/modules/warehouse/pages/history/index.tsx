import { HistoryPageTemplate } from '@/modules/history/templates'
import { useLocationState } from '@/shared/hooks'
import React, { useMemo } from 'react'

export const WarehouseHistory = () => {
	const [warehouseItemId] = useLocationState(extractIdFromState)

	function extractIdFromState(state: any) {
		return state.id as number
	}

	const title = useMemo(() => {
		return 'Історія складу'
	}, [])

	return <HistoryPageTemplate title={title} records={[]} />
}
