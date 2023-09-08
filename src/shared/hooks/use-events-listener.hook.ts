import { useEffect } from 'react'
import { AppEvents, appEvents } from '../events'

export const useEventsListener = <T extends keyof AppEvents>(
	name: T,
	action: (data: AppEvents[T]) => void,
	dependencies: any[] = [],
) => {
	useEffect(() => {
		const fn = (data: AppEvents[T]) => {
			try {
				action(data)
			} catch (e) {}
		}
		appEvents.on(name, fn)

		return () => appEvents.off(name, fn)
	}, dependencies)
}

export const useAPICalEventsListener = <T extends string>(
	_name: T,
	action: (data: any) => void,
	dependencies: any[] = [],
) => {
	useEffect(() => {
		const name = `apiCall_${String(_name)}`

		const fn = (data: any) => {
			try {
				action(data)
			} catch (e) {}
		}
		appEvents.on(name as any, fn)

		return () => appEvents.off(name as any, fn)
	}, dependencies)
}
