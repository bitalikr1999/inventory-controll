import { IProduct } from '@/@types/interfaces'
import { useStoreDate } from '@/shared/hooks'
import { Col, Modal, Row, Table } from 'antd'
import { AddProductModalSmart } from '../../smart-components'
import { ProductsTableConfig } from './table.config'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { cloneDeep } from 'lodash'

export const ProductsListPage = () => {
	const { data: list, set } = useStoreDate<IProduct[]>({
		store: 'products',
		field: 'list',
	})
	const [editedProduct, setProductToEdit] = useState<IProduct>(null)

	const onPressDelete = (product: IProduct) => {
		Modal.confirm({
			title: 'Ви впевненні?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Так',
			cancelText: 'Ні',
			onOk: () => {
				const _list = cloneDeep(list)
				set(_list.filter(it => it.id !== product.id))
			},
		})
	}

	const onPressEdit = (product: IProduct) => {
		setProductToEdit(product)
	}

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
				dataSource={list}
				columns={ProductsTableConfig({ onPressDelete, onPressEdit })}
			/>
		</div>
	)
}
