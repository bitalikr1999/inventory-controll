import { GroupCategoryKey } from '@/@types/enums'
import { useEffect, useRef, useState } from 'react'

export const useChildrenCount = (
	date: Date,
	groupCategory: GroupCategoryKey,
) => {
	const [count, setCount] = useState(0)
	const timmerRef = useRef(null)
	const [isLoading, setLoading] = useState(false)

	const getChildrenCount = async () => {
		const _date = new Date(date)
		const count = await window.Main.emit('childrenCountByDay', {
			groupCategory: groupCategory,
			date: `${_date.getFullYear()}/${_date.getMonth()}`,
			day: _date.getDate(),
		})

		setCount(count)
		setLoading(false)
	}

	useEffect(() => {
		if (timmerRef.current) clearTimeout(timmerRef.current)
		if (groupCategory && date) {
			setLoading(true)
			timmerRef.current = setTimeout(() => {
				getChildrenCount()
			}, 500)
		}
		return () => {
			clearTimeout(timmerRef.current)
		}
	}, [groupCategory, date])

	return {
		count,
		isLoading,
	}
}
