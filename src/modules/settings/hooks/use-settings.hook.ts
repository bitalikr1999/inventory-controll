import { ISetting } from '@/@types/interfaces'
import { useEffect, useState } from 'react'
import { settingsAPI } from '../api'
import { useAPICalEventsListener } from '@/shared/hooks'

export const useSettings = () => {
	const [items, setItems] = useState<ISetting[]>([])

	const [isLoading, setLoading] = useState(false)

	const load = async () => {
		try {
			setLoading(true)
			const data = await settingsAPI.getAll()
			setItems(data)
		} finally {
			setLoading(false)
		}
	}

	useAPICalEventsListener('settings/put', load)

	useEffect(() => {
		load()
	}, [])

	return {
		items,
		isLoading,
	}
}
