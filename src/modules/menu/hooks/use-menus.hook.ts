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

	const remove = async (id: number) => {
		await window.Main.emit('removeMenu', id)
		resetData()
	}

	const getOne = async (id: number) => {
		return window.Main.emit('getMenu', id)
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
		getOne,
		remove,
	}
}
