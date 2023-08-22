import { RouteKey } from '@/@types/enums'
import {
	AppstoreAddOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Button, Modal, Row, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useWarehouseList } from '../../hooks'
import { WarehouseTableConfig } from './table.config'
import { WarehouseAdmissionModalSmart } from '../../smart-components/warehouse-admission-modal'
import { useState } from 'react'
import { IProduct } from '@/@types/interfaces'

export const WarehouseListPage = () => {
	const navigate = useNavigate()
	const { items, remove, reload } = useWarehouseList()
	const [product, setProduct] = useState<IProduct>(null)

	const onPressDelete = (id: string) => {
		Modal.confirm({
			title: 'Ви впевненні?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Так',
			cancelText: 'Ні',
			onOk: () => remove(id),
		})
	}
	const onAdmission = () => {
		reload()
		setProduct(null)
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
				<Button
					type="primary"
					icon={<AppstoreAddOutlined />}
					size="middle"
					style={{
						marginLeft: 15,
					}}
					onClick={() => navigate(RouteKey.WarehouseCategories)}>
					Категорії
				</Button>
			</Row>
			<Table
				dataSource={items}
				columns={WarehouseTableConfig(onPressDelete, setProduct)}
			/>

			<WarehouseAdmissionModalSmart
				product={product}
				onPressClose={onAdmission}
			/>
		</div>
	)
}
