import { IProduct } from '@/@types/interfaces'
import { useStoreDate } from '@/shared/hooks'
import { Button, Col, Row, Table } from 'antd'
import { AddProductModalSmart } from '../../smart-components'
import { ProductsTableConfig } from './table.config'

export const ProductsListPage = () => {
	const { data: list, set } = useStoreDate<IProduct[]>({
		store: 'products',
		field: 'list',
	})

	return (
		<div>
			<Row align="middle">
				<Col span={16}>
					<h1>Продукти</h1>
				</Col>
				<Col span={8} className="col-right">
					<AddProductModalSmart />
				</Col>
			</Row>
			<Table dataSource={list} columns={ProductsTableConfig} />;
		</div>
	)
}
