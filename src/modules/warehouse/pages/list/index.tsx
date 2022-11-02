import { RouteKey } from '@/@types/enums'
import {
	AppstoreAddOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Button, Col, Modal, Row, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useWarehouseList } from '../../hooks'
import { WarehouseTableConfig } from './table.config'

export const WarehouseListPage = () => {
	const navigate = useNavigate()
	const { items, remove } = useWarehouseList()

	const onPressDelete = (id: string) => {
		Modal.confirm({
			title: 'Ви впевненні?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Так',
			cancelText: 'Ні',
			onOk: () => remove(id),
		})
	}

	return (
		<div>
			<Row align="middle" justify="start" style={{ marginBottom: 20 }}>
				<h1 style={{ marginBottom: 0 }}>Склад</h1>
				<Button
					type="primary"
					icon={<AppstoreAddOutlined />}
					size="middle"
					style={{
						marginLeft: 15,
						backgroundColor: '#13cf74',
						borderColor: '#13cf74',
					}}
					onClick={() => navigate(RouteKey.WarehouseAdmission)}>
					Поступлення
				</Button>
			</Row>
			<Table
				dataSource={items}
				columns={WarehouseTableConfig(onPressDelete)}
			/>
			;
		</div>
	)
}
