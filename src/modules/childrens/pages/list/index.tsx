import { GroupCategoryKey, RouteKey } from '@/@types/enums'
import { IGroup } from '@/@types/interfaces'
import { Button, Col, Row, Table, Tabs } from 'antd'
import { GroupsTileList } from '../../components'
import { useChildrensGroups } from '../../hooks'
import { GroupEditorSmart } from '../../smart-components'
import { useNavigate } from 'react-router-dom'

const { TabPane } = Tabs

export const ChildrensListPage = () => {
	const { data, byCategory } = useChildrensGroups()
	const navigate = useNavigate()

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

	return (
		<div>
			<Row align="middle">
				<Col span={16}>
					<h1>Групи дітей</h1>
				</Col>
				<Col span={8} className="col-right">
					<GroupEditorSmart />
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
					/>
				</TabPane>
				<TabPane tab="4-6 р." key={GroupCategoryKey.Middle}>
					<GroupsTileList
						items={byCategory.middle}
						onPressItem={openGroup}
						onPressCalendar={openGroupCalendar}
					/>
				</TabPane>
				<TabPane tab="Працівники" key={GroupCategoryKey.Senior}>
					<GroupsTileList
						items={byCategory.senior}
						onPressItem={openGroup}
						onPressCalendar={openGroupCalendar}
					/>
				</TabPane>
			</Tabs>

			{/* <Table dataSource={list} columns={ProductsTableConfig} />; */}
		</div>
	)
}
