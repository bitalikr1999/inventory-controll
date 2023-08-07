import React, { useMemo, useState } from 'react'
import { ProductCategory, RouteKey } from '@/@types/enums'

import { Button, Col, Modal, Row, Table } from 'antd'
import './styles.css'
import { productsCategoryLabels } from '@/modules/products/config'

import cerealsImg from '@/assets/cereals.jpeg'
import meatImg from '@/assets/meat.jpeg'
import fishImg from '@/assets/fish.jpeg'
import fruitsImg from '@/assets/fruits.jpeg'
import groceriesImg from '@/assets/groceries.jpeg'
import milkImg from '@/assets/milk.jpeg'
import mushroomsImg from '@/assets/mushrooms.jpeg'
import vegetablesImg from '@/assets/vegetables.jpeg'
import { useWarehouseList } from '../../hooks'
import { WarehouseTableConfig } from '../list/table.config'
import { noop } from 'lodash'
import {
	AppstoreAddOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { WarehouseAdmissionModalSmart } from '../../smart-components/warehouse-admission-modal'
import { IProduct } from '@/@types/interfaces'

const categoriesList = [
	{
		value: ProductCategory.Meat,
		image: meatImg,
	},
	{
		value: ProductCategory.Fish,
		image: fishImg,
	},
	{
		value: ProductCategory.Fruits,
		image: fruitsImg,
	},
	{
		value: ProductCategory.Vegetables,
		image: vegetablesImg,
	},
	{
		value: ProductCategory.Milk,
		image: milkImg,
	},
	{
		value: ProductCategory.Cereals,
		image: cerealsImg,
	},
	{
		value: ProductCategory.Groceries,
		image: groceriesImg,
	},

	{
		value: ProductCategory.Mushrooms,
		image: mushroomsImg,
	},
]

export const ProductsCategoriesPage = () => {
	const navigate = useNavigate()
	const [category, setCategory] = useState(null)
	const [product, setProduct] = useState<IProduct>(null)

	const { items, remove, reload } = useWarehouseList()

	const selectedItems = useMemo(() => {
		if (!category) return []

		return items.filter(it => it.product.category === category)
	}, [items, category])

	console.log('selectedItems', selectedItems, items, category)

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
