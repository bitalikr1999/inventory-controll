import { GroupCategoryKey } from '@/@types/enums'
import { IGroup } from '@/@types/interfaces'
import { useMultyHookState } from '@/shared/hooks'
import { useEffect, useMemo } from 'react'
import { childrensGroupsAPI } from '../api/childrens-groups.api'

export const useChildrensGroups = () => {
	const [data, setData] = useMultyHookState<IGroup[]>('children-groups', [])

	const resetData = async () => {
		const _data = await childrensGroupsAPI.getAll()
		setData(_data)
	}

	const set = async (_data: any) => {
		await childrensGroupsAPI.add(_data)
		resetData()
	}

	const update = async (_data: any) => {
		await childrensGroupsAPI.edit(_data)
		resetData()
	}

	useEffect(() => {
		resetData()
	}, [])

	const byCategory: Record<GroupCategoryKey, IGroup[]> = useMemo(() => {
		if (!data) return {}
		return data.reduce((res: Record<GroupCategoryKey, IGroup[]>, item) => {
			if (!res[item.category]) res[item.category] = []
			res[item.category].push(item)
			return res
		}, {} as any)
	}, [data])

	return {
		data,
		resetData,
		set,
		byCategory,
		update,
	}
}
