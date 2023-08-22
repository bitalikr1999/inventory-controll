import { useEffect, useState } from 'react'
import { IMenu } from 'electron/typing'

import { useMultyHookState } from '@/shared/hooks'

import { menusAPI } from '../api'

interface UseMenusParams {
	filterMenus?: (items: IMenu[]) => IMenu[]
}

export const useMenus = ({ filterMenus = items => items }: UseMenusParams) => {
	const [data, setData] = useMultyHookState<IMenu[]>('menus', [])
	const [date, setDate] = useState(new Date())

	const resetData = async () => {
		const _data = await menusAPI.getMany(new Date(date))
		setData(filterMenus(_data))
	}

	const set = async (payload: any) => {
		await menusAPI.put(payload)
		resetData()
	}

	const remove = async (id: string) => {
		await menusAPI.remove(id)
		resetData()
	}

	const getOne = async (id: string) => {
		return await menusAPI.getOne(id)
	}

	useEffect(() => {
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
