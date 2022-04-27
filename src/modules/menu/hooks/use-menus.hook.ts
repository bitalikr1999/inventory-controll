import { GroupCategoryKey } from '@/@types/enums'
import { IGroup, IMenu } from '@/@types/interfaces'
import { appEvents } from '@/shared/events'
import { useEventsListener } from '@/shared/hooks/use-events-listener.hook'
import { useEffect, useMemo, useState } from 'react'

export const useMenus = () => {
	const [data, setData] = useState<IMenu[]>()

	const resetData = async () => {
		const _data = await window.Main.emit('getMenus', new Date())
		appEvents.emit('onChangeStoreData', {
			key: 'menus',
			data: _data,
		})
	}

	const set = async (_data: any) => {
		await window.Main.emit('addMenu', _data)
		resetData()
	}

	useEventsListener('onChangeStoreData', ({ key, data }) => {
		if ('menus' === key) setData(data)
	})

	useEffect(() => {
		resetData()
	}, [])

	return {
		data,
		resetData,
		set,
	}
}
