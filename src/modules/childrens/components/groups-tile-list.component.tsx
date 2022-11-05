import { IGroup } from '@/@types/interfaces'
import {
	EditOutlined,
	EllipsisOutlined,
	FieldTimeOutlined,
	ForwardOutlined,
	FullscreenOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import { Avatar, Card, Col, Row } from 'antd'
import Meta from 'antd/lib/card/Meta'
import _ from 'lodash'
import { FC } from 'react'

interface Props {
	items: IGroup[]
	onPressItem: (item: IGroup) => void
	onPressCalendar: (item: IGroup) => void
}

export const GroupsTileList: FC<Props> = ({
	items,
	onPressItem,
	onPressCalendar,
}) => {
	const renderItems = () => {
		if (_.isEmpty(items)) return null
		return items.map(it => {
			return (
				<Col span={8} style={{ padding: '0 10px' }}>
					<Card
						actions={[
							<SettingOutlined
								key="setting"
								title="Налаштування"
							/>,
							<EditOutlined
								key="edit"
								title="Редагувати"
								onClick={() => onPressItem(it)}
							/>,
							<FieldTimeOutlined
								key="calendar"
								title="Пропуски"
								onClick={() => onPressCalendar(it)}
							/>,
						]}>
						<Meta
							avatar={
								<Avatar src="https://joeschmoe.io/api/v1/random" />
							}
							title={it.name}
							description={`Кількість: ${_.defaultTo(
								it.childrens?.length,
								0,
							)}`}
						/>
					</Card>
				</Col>
			)
		})
	}

	return <Row>{renderItems()}</Row>
}
