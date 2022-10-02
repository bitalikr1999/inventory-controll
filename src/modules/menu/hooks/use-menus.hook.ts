import { IMenu } from '@/@types/interfaces'
import { appEvents } from '@/shared/events'
import { useEventsListener } from '@/shared/hooks/use-events-listener.hook'
import { useEffect, useState } from 'react'

interface UseMenusParams {
	filterMenus?: (items: IMenu[]) => IMenu[]
}

export const useMenus = ({ filterMenus = items => items }: UseMenusParams) => {
	const [data, setData] = useState<IMenu[]>()
	const [date, setDate] = useState(new Date())

	const resetData = async () => {
		console.log('get menus ', new Date(date).toISOString())
		const _data = await window.Main.emit(
			'getMenus',
			new Date(date).toISOString(),
		)
		console.log('result', _data)
		appEvents.emit('onChangeStoreData', {
			key: 'menus',
			data: filterMenus(_data),
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
		console.log('reload', date)
		resetData()
	}, [date])

	return {
		data,
		resetData,
		set,
		getOne,
		remove,
		date,
		setDate,
	}
}
