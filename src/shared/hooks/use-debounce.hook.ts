import { useEffect, useRef } from 'react'

export const useDebounce = (callback: () => void, deps: any[], delay = 500) => {
	const timmerRef = useRef(null)

	useEffect(() => {
		if (timmerRef.current) clearTimeout(timmerRef.current)

		timmerRef.current = setTimeout(() => {
			callback()
		}, delay)

		return () => {
			clearTimeout(timmerRef.current)
		}
	}, deps)
}
