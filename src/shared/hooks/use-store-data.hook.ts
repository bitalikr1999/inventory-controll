import { useEffect, useState } from 'react'
import { appEvents } from '../events'
import { useEventsListener } from './use-events-listener.hook'

interface Options<T> {
	store: 'products' | 'settings'
	field: string
	serrialization?: (data: any) => T
}

export const useStoreDate = <T>({
	store,
	field,
	serrialization,
}: Options<T>) => {
	const [data, setData] = useState<T>()

	const resetData = async () => {
		const _data = await window.Main.getStore(store, field)
		console.log(_data)
		setData(serrialization ? serrialization(_data) : _data)
	}

	const getDataKey = () => `${store}|${field}`

	const set = async (_data: any) => {
		console.log(_data)
		await window.Main.setToStore(store, field, _data)
		appEvents.emit('onChangeStoreData', {
			key: getDataKey(),
			data: _data,
		})
	}

	useEventsListener('onChangeStoreData', ({ key, data }) => {
		if (getDataKey() === key) setData(data)
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
