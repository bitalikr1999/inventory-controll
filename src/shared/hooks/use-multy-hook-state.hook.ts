import { useState } from 'react'
import { appEvents } from '../events'
import { useEventsListener } from './use-events-listener.hook'

export const useMultyHookState = <T>(
	_key: string,
	defaultData: T | null,
): [T, (data: T) => void] => {
	const [state, setState] = useState<T>(defaultData)

	const changeState = (data: T) => {
		appEvents.emit('onChangeStoreData', {
			key: _key,
			data,
		})
	}

	useEventsListener('onChangeStoreData', ({ key, data }) => {
		if (_key === key) setState(data)
	})

	return [state, changeState]
}
