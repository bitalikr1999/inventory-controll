import { GroupCategoryKey } from '@/@types/enums'
import { IGroup } from '@/@types/interfaces'
import { appEvents } from '@/shared/events'
import { useEventsListener } from '@/shared/hooks/use-events-listener.hook'
import { useEffect, useMemo, useState } from 'react'

export const useChildrensGroups = () => {
	const [data, setData] = useState<IGroup[]>()

	const resetData = async () => {
		const _data = await window.Main.emit('getGroups', null)
		appEvents.emit('onChangeStoreData', {
			key: 'children-groups',
			data: _data,
		})
	}

	const set = async (_data: any) => {
		await window.Main.emit('addGroup', _data)
		resetData()
	}

	const update = async (_data: any) => {
		await window.Main.emit('editGroup', _data)
		resetData()
	}

	useEventsListener('onChangeStoreData', ({ key, data }) => {
		if ('children-groups' === key) setData(data)
	})

	useEffect(() => {
		resetData()
	}, [])

	const byCategory: Record<GroupCategoryKey, IGroup[]> = useMemo(() => {
		if (!data) return {}
		return data.reduce((res: Record<GroupCategoryKey, IGroup[]>, item) => {
			if (!res[item.category]) res[item.category] = []
			res[item.category].push(item)
			return res
		}, {} as any)
	}, [data])

	return {
		data,
		resetData,
		set,
		byCategory,
		update,
	}
}
