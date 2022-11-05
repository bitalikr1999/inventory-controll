import { PageHeader } from '@/shared/components/grid'
import { Table } from 'antd'
import { useLocation } from 'react-router-dom'
import { ChildreEditorPayloadDto } from '../../dto'
import { useChildrenGroup } from '../../hooks'
import { ChildrenEditor } from '../../smart-components'
import { ChildrensTableConfig } from './table-config'

export const GroupPage = () => {
	const location: any = useLocation()

	const { group, addChildren } = useChildrenGroup(location.state?._id)

	const onSubmitChildrenEditor = (payload: ChildreEditorPayloadDto) => {
		addChildren(payload)
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
					/>
				}
			/>
			<Table
				dataSource={group?.childrens}
				columns={ChildrensTableConfig}
			/>
		</div>
	)
}
