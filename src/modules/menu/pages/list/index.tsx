import { RouteKey } from '@/@types/enums'
import { PageHeader } from '@/shared/components/grid'
import { prepareDateForDatePicker } from '@/shared/helpers'
import {
	AppstoreAddOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Button, Col, DatePicker, Modal, Row, Table } from 'antd'
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'
import { MenuItem } from '../../components/menu-item.component'
import { useMenus } from '../../hooks'
import locale from 'antd/es/date-picker/locale/uk_UA'

export const MenuListPage = () => {
	const navigate = useNavigate()

	const { data, remove, date, setDate } = useMenus({})

	const onPressRemove = (id: number) => {
		Modal.confirm({
			title: 'Ви впевненні?',
			icon: <ExclamationCircleOutlined />,
			content: 'Ви хочете видалити меню',
			okText: 'Підтвердити',
			cancelText: 'Відмінити',
			onOk: () => remove(id),
		})
	}

	const generateXlsx = () => {
		window.Main.emit('generateMenu', { menus: data })
	}

	const renderItems = () => {
		if (_.isEmpty(data)) return null
		return data
			.sort((a, b) => b.id - a.id)
			.map(it => {
				return (
					<Col span={8} style={{ padding: 10 }}>
						<MenuItem
							menu={it}
							onPressItem={() =>
								navigate(RouteKey.MenuEditor, {
									state: { id: it.id },
								})
							}
							onPressDelete={() => onPressRemove(it.id)}
						/>
					</Col>
				)
			})
	}

	console.log(data)
	return (
		<>
			<PageHeader
				title={`Меню`}
				rightComponent={
					<>
						<Button
							type="primary"
							icon={<AppstoreAddOutlined />}
							size="middle"
							style={{ marginRight: 15 }}
							onClick={() => generateXlsx()}>
							Згенерувати XLSX
						</Button>
						<DatePicker
							onChange={val => setDate(val as any)}
							value={prepareDateForDatePicker(date)}
							picker="month"
							locale={locale}
							style={{ minWidth: 150, marginRight: 15 }}
						/>
						<Button
							type="primary"
							icon={<AppstoreAddOutlined />}
							size="middle"
							onClick={() => navigate(RouteKey.MenuEditor)}>
							Створити
						</Button>
					</>
				}
			/>
			<Row>{renderItems()}</Row>
		</>
	)
}
