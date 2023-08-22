import { IChildrenCalendarRecord } from '@/@types/interfaces'
import { useState } from 'react'
import { childrensCalendarsAPI } from '../api/childrens-calendars.api'

export const useChildrenGroupCalendar = () => {
	const [calendar, setCalendar] = useState<IChildrenCalendarRecord>(null)

	const fetch = async (groupId: string, date: string) => {
		const data = await childrensCalendarsAPI.getOne({ groupId, date })
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
