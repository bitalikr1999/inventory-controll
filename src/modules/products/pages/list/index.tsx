import { IProduct } from '@/@types/interfaces'
import { Col, Modal, Row, Table } from 'antd'
import { AddProductModalSmart } from '../../smart-components'
import { ProductsTableConfig } from './table.config'
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useProducts } from '../../hooks'
import { productsAPI } from '../../api'

export const ProductsListPage = () => {
	const { items, isLoading } = useProducts(true)

	const [editedProduct, setProductToEdit] = useState<IProduct>(null)

	const onPressDelete = (product: IProduct) => {
		Modal.confirm({
			title: 'Ви впевненні?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Так',
			cancelText: 'Ні',
			onOk: () => productsAPI.delete(product._id),
		})
	}

	const onPressEdit = (product: IProduct) => {
		setProductToEdit(product)
	}

	useEffect(() => {
		setProductToEdit(null)
	}, [items])

	if (isLoading) return <LoadingOutlined />

	return (
		<div>
			<Row align="middle">
				<Col span={16}>
					<h1>Продукти</h1>
				</Col>
				<Col span={8} className="col-right">
					<AddProductModalSmart existProduct={editedProduct} />
				</Col>
			</Row>
			<Table
				dataSource={items}
				columns={ProductsTableConfig({ onPressDelete, onPressEdit })}
			/>
		</div>
	)
}
