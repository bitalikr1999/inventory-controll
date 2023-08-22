import { IGroup } from '@/@types/interfaces'
import { useEffect } from 'react'
import { ChildreEditorPayloadDto } from '../dto'
import { useMultyHookState } from '@/shared/hooks'
import { childrensGroupsAPI } from '../api/childrens-groups.api'
import { childrenAPI } from '../api/childrens.api'

export const useChildrenGroup = (id: string) => {
	const [group, setGroup] = useMultyHookState<IGroup>(`group-${id}`, null)

	const resetData = async () => {
		const _data = await childrensGroupsAPI.getOne(id)
		setGroup(_data)
	}

	useEffect(() => {
		if (id) resetData()
	}, [id])

	const addChildren = async (data: ChildreEditorPayloadDto) => {
		await childrenAPI.add({
			...data,
			birthday: data.birthday,
			groupId: id,
		})
		resetData()
	}

	const editChildren = async (_id: string, data: ChildreEditorPayloadDto) => {
		await childrenAPI.edit({
			_id,
			...data,
			birthday: data.birthday,
			groupId: id,
		})
		resetData()
	}

	return {
		group,
		resetData,
		addChildren,
		editChildren,
	}
}
