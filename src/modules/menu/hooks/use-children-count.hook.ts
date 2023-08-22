import { useState } from 'react'
import { GroupCategoryKey } from '@/@types/enums'
import { childrensCalendarsAPI } from '@/modules/childrens/api/childrens-calendars.api'
import { dateToYMstring } from '@/shared/helpers'
import { useDebounce } from '@/shared/hooks/use-debounce.hook'

export const useChildrenCount = (
	date: Date,
	groupCategory: GroupCategoryKey,
) => {
	const [count, setCount] = useState(0)
	const [isLoading, setLoading] = useState(false)

	const getChildrenCount = async () => {
		const count = await childrensCalendarsAPI.getPresentChildrenCount(
			prepareParams(),
		)
		setCount(count)
		setLoading(false)
	}

	const prepareParams = () => {
		const _date = new Date(date)
		return {
			groupCategory: groupCategory,
			date: dateToYMstring(_date),
			day: _date.getDate(),
		}
	}

	useDebounce(() => {
		if (!groupCategory || !date) return
		setLoading(true)
		getChildrenCount()
	}, [groupCategory, date])

	return {
		count,
		isLoading,
	}
}
