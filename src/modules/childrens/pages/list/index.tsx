import { GroupCategoryKey, RouteKey } from '@/@types/enums'
import { IGroup } from '@/@types/interfaces'
import { Button, Col, Modal, Row, Table, Tabs } from 'antd'
import { GroupsTileList } from '../../components'
import { useChildrensGroups } from '../../hooks'
import { GroupEditorSmart } from '../../smart-components'
import { useNavigate } from 'react-router-dom'
import { PrinterOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { childrensCalendarsAPI } from '../../api/childrens-calendars.api'
import { childrensGroupsAPI } from '../../api/childrens-groups.api'

const { TabPane } = Tabs

export const ChildrensListPage = () => {
	const { byCategory, resetData: reloadGroups } = useChildrensGroups()
	const navigate = useNavigate()
	const [group, setGroup] = useState<IGroup>(null)

	const openGroup = (group: IGroup) => {
		navigate(RouteKey.Group, {
			state: group,
		})
	}

	const openGroupCalendar = (group: IGroup) => {
		navigate(RouteKey.GroupCalendar, {
			state: group,
		})
	}

	const generateReportCard = () => {
		childrensCalendarsAPI.generateReportCardXlsx({
			date: `${new Date().getFullYear()}/${new Date().getMonth()}`,
		})
	}
	const onPressEdit = (group: IGroup) => {
		setGroup(group)
	}

	const onPressRemove = (group: IGroup) => {
		Modal.confirm({
			title: 'Ви впевненні?',
			content: `що хочете видалити групу ${group.name}`,
			onOk: () => removeGroup(group._id),
		})
	}

	const removeGroup = async (groupId: string) => {
		await childrensGroupsAPI.remove(groupId)
		reloadGroups()
	}

	return (
		<div>
			<Row align="middle">
				<Col span={16}>
					<h1>Групи дітей</h1>
				</Col>
				<Col span={8} className="col-right">
					<Button
						type="primary"
						icon={<PrinterOutlined />}
						size="middle"
						style={{
							backgroundColor: '#52c41a',
							borderColor: '#52c41a',
							marginRight: 15,
						}}
						onClick={generateReportCard}>
						Згенерувати XLSX
					</Button>
					<GroupEditorSmart
						existData={group}
						onPressClose={() => setGroup(null)}
					/>
				</Col>
			</Row>

			<Tabs
				defaultActiveKey={GroupCategoryKey.Junior}
				type="card"
				size="middle">
				<TabPane tab="1-4 р." key={GroupCategoryKey.Junior}>
					<GroupsTileList
						items={byCategory.junior}
						onPressItem={openGroup}
						onPressCalendar={openGroupCalendar}
						onPressEdit={onPressEdit}
						onPressRemove={onPressRemove}
					/>
				</TabPane>
				<TabPane tab="4-6 р." key={GroupCategoryKey.Middle}>
					<GroupsTileList
						items={byCategory.middle}
						onPressItem={openGroup}
						onPressCalendar={openGroupCalendar}
						onPressEdit={onPressEdit}
						onPressRemove={onPressRemove}
					/>
				</TabPane>
				<TabPane tab="Працівники" key={GroupCategoryKey.Senior}>
					<GroupsTileList
						items={byCategory.senior}
						onPressItem={openGroup}
						onPressCalendar={openGroupCalendar}
						onPressEdit={onPressEdit}
						onPressRemove={onPressRemove}
					/>
				</TabPane>
			</Tabs>

			{/* <Table dataSource={list} columns={ProductsTableConfig} />; */}
		</div>
	)
}
