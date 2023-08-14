import { PageHeader } from '@/shared/components/grid'
import { Table } from 'antd'
import { useLocation } from 'react-router-dom'
import { ChildreEditorPayloadDto } from '../../dto'
import { useChildrenGroup } from '../../hooks'
import { ChildrenEditor } from '../../smart-components'
import { ChildrensTableConfig } from './table-config'
import { IChildren } from '@/@types/interfaces'
import { useState } from 'react'

export const GroupPage = () => {
	const location: any = useLocation()

	const { group, addChildren, editChildren } = useChildrenGroup(
		location.state?._id,
	)
	const [child, setChild] = useState<IChildren>()

	const onSubmitChildrenEditor = (payload: ChildreEditorPayloadDto) => {
		console.log(child)
		if (child) {
			editChildren(child._id, payload)
		} else addChildren(payload)
	}

	const onPressEdit = (children: IChildren) => {
		setChild(children)
	}

	return (
		<div>
			<PageHeader
				title={`Група: ${group?.name}`}
				showBack={true}
				rightComponent={
					<ChildrenEditor
						groupId={group?._id}
						onSubmit={onSubmitChildrenEditor}
						existData={child}
					/>
				}
			/>
			<Table
				dataSource={group?.childrens}
				columns={ChildrensTableConfig({ onPressEdit })}
			/>
		</div>
	)
}
