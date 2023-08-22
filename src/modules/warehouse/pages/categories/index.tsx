import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Modal, Row, Table } from 'antd'

import { RouteKey } from '@/@types/enums'
import { productsCategoryLabels } from '@/modules/products/config'

import { useWarehouseList } from '../../hooks'
import { WarehouseTableConfig } from '../list/table.config'
import {
	AppstoreAddOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons'

import { WarehouseAdmissionModalSmart } from '../../smart-components/warehouse-admission-modal'
import { IProduct } from '@/@types/interfaces'
import { categoriesList } from './config'

import './styles.css'

export const ProductsCategoriesPage = () => {
	const navigate = useNavigate()
	const [category, setCategory] = useState(null)
	const [product, setProduct] = useState<IProduct>(null)

	const { items, remove, reload } = useWarehouseList()

	const selectedItems = useMemo(() => {
		if (!category) return []

		return items.filter(it => it.product.category === category)
	}, [items, category])

	const renderCategories = () => {
		return categoriesList.map(item => {
			return (
				<Col span={8}>
					<div
						className="category-block"
						onClick={() => setCategory(item.value)}>
						<img src={item.image} alt="" />
						<div className="category-block-content">
							<p>{productsCategoryLabels[item.value]}</p>
						</div>
					</div>
				</Col>
			)
		})
	}

	const onPressDelete = (id: string) => {
		Modal.confirm({
			title: 'Ви впевненні?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Так',
			cancelText: 'Ні',
			onOk: () => remove(id),
		})
	}

	const renderContent = () => {
		if (!category) return <Row gutter={12}>{renderCategories()}</Row>
		return (
			<Table
				dataSource={selectedItems}
				columns={WarehouseTableConfig(onPressDelete, setProduct)}
			/>
		)
	}

	const onAdmission = () => {
		reload()
		setProduct(null)
	}

	return (
		<div>
			<Row align="middle" justify="start" style={{ marginBottom: 20 }}>
				<h1 style={{ marginBottom: 0 }}>Склад</h1>
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-end',
					}}>
					{category ? (
						<Button
							type="primary"
							icon={<AppstoreAddOutlined />}
							size="middle"
							onClick={() => setCategory(null)}>
							Повернутись до категорій
						</Button>
					) : null}
					<Button
						type="primary"
						icon={<AppstoreAddOutlined />}
						size="middle"
						style={{
							marginLeft: 15,
							backgroundColor: '#13cf74',
							borderColor: '#13cf74',
						}}
						onClick={() => navigate(RouteKey.Warehouse)}>
						Перейти на повний список
					</Button>
				</div>
			</Row>

			{renderContent()}

			<WarehouseAdmissionModalSmart
				product={product}
				onPressClose={onAdmission}
			/>
		</div>
	)
}
