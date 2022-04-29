import { RouteKey } from '@/@types/enums'
import { PageHeader } from '@/shared/components/grid'
import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, Col, Row, Table } from 'antd'
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'
import { MenuItem } from '../../components/menu-item.component'
import { useMenus } from '../../hooks'

export const MenuListPage = () => {
	const navigate = useNavigate()

	const { data, remove } = useMenus()

	const renderItems = () => {
		if (_.isEmpty(data)) return null
		return data.reverse().map(it => {
			return (
				<Col span={8} style={{ padding: 10 }}>
					<MenuItem
						menu={it}
						onPressItem={() =>
							navigate(RouteKey.MenuEditor, {
								state: { id: it.id },
							})
						}
						onPressDelete={() => remove(it.id)}
					/>
				</Col>
			)
		})
	}

	return (
		<>
			<PageHeader
				title={`Меню`}
				rightComponent={
					<Button
						type="primary"
						icon={<AppstoreAddOutlined />}
						size="middle"
						onClick={() => navigate(RouteKey.MenuEditor)}>
						Створити
					</Button>
				}
			/>
			<Row>{renderItems()}</Row>
		</>
	)
}
