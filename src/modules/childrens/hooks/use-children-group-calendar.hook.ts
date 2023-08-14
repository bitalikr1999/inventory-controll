import { IChildrenCalendarRecord } from '@/@types/interfaces'
import { useState } from 'react'

export const useChildrenGroupCalendar = () => {
	const [calendar, setCalendar] = useState<IChildrenCalendarRecord>(null)

	const fetch = async (groupId: string, date: string) => {
		const data = await window.Main.emit('getChildrenGroupCalendar', {
			groupId,
			date,
		})

		console.log('data', data)
		setCalendar(data)
	}

	const getDateKey = (date: Date) => {
		if (!date) return ''
		return `${date.getFullYear()}/${date.getMonth()}`
	}

	return {
		fetch,
		calendar,
		getDateKey,
	}
}
