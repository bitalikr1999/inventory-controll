import { IGroup } from '@/@types/interfaces'
import { appEvents } from '@/shared/events'
import { useEventsListener } from '@/shared/hooks/use-events-listener.hook'
import { useEffect, useState } from 'react'
import { ChildreEditorPayloadDto } from '../dto'

export const useChildrenGroup = (id: number) => {
	const [group, setGroup] = useState<IGroup>()

	const resetData = async () => {
		const _data = await window.Main.emit('getGroup', id)
		appEvents.emit('onChangeStoreData', {
			key: `group-${id}`,
			data: _data,
		})
	}

	useEventsListener('onChangeStoreData', ({ key, data }) => {
		if (`group-${id}` === key) setGroup(data)
	})

	useEffect(() => {
		resetData()
	}, [])

	const addChildren = async (data: ChildreEditorPayloadDto) => {
		console.log('DATA', {
			...data,
			groupId: id,
		})
		await window.Main.emit('addChildren', {
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
	}
}
