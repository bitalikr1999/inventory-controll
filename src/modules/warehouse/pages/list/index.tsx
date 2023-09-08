import { RouteKey } from '@/@types/enums'
import {
	AppstoreAddOutlined,
	ExclamationCircleOutlined,
	FallOutlined,
} from '@ant-design/icons'
import { Button, Input, Modal, Row, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useWarehouseList } from '../../hooks'
import { WarehouseTableConfig } from './table.config'
import { WarehouseAdmissionModalSmart } from '../../smart-components/warehouse-admission-modal'
import { useMemo, useState } from 'react'
import { IProduct } from '@/@types/interfaces'
import { productsAPI } from '@/modules/products/api'
import { $eventVal } from '@/shared/helpers'
import _ from 'lodash'

export const WarehouseListPage = () => {
	const navigate = useNavigate()
	const { items, remove, reload } = useWarehouseList()
	const [product, setProduct] = useState<IProduct>(null)
	const [search, setSearch] = useState('')

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

	const itemsToRender = useMemo(() => {
		return _.filter(items, function (item) {
			return (
				item.product.name
					.toLocaleLowerCase()
					.indexOf(search.toLocaleLowerCase()) > -1
			)
		})
	}, [items, search])

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
				<Button
					type="default"
					icon={<FallOutlined />}
					size="middle"
					style={{
						marginLeft: 15,
					}}
					onClick={() => navigate(RouteKey.WarehouseHistory)}>
					Історія
				</Button>

				<Input
					placeholder="Пошук"
					value={search}
					onChange={e => setSearch($eventVal(e))}
				/>
			</Row>
			<Table
				dataSource={itemsToRender}
				columns={WarehouseTableConfig(onPressDelete, setProduct)}
				rowKey={'_id'}
			/>

			<WarehouseAdmissionModalSmart
				product={product}
				onPressClose={onAdmission}
			/>
		</div>
	)
}
