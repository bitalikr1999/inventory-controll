import { RouteKey } from '@/@types/enums'
import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, Col, Row, Table } from 'antd'
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'
import { MenuItem } from '../../components/menu-item.component'
import { useMenus } from '../../hooks'

export const MenuListPage = () => {
	const navigate = useNavigate()

	const { data } = useMenus()

	const renderItems = () => {
		if (_.isEmpty(data)) return null
		return data.map(it => {
			return (
				<Col span={6}>
					<MenuItem menu={it} />
				</Col>
			)
		})
	}

	return (
		<>
			<Row align="middle">
				<Col span={16}>
					<h1>Меню</h1>
				</Col>
				<Col span={8} className="col-right">
					<Button
						type="primary"
						icon={<AppstoreAddOutlined />}
						size="middle"
						onClick={() => navigate(RouteKey.MenuEditor)}>
						Створити
					</Button>
				</Col>
			</Row>
			<Row>{renderItems()}</Row>
		</>
	)
}
