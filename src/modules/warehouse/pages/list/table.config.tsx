import React from 'react'
import { IProduct, IWarehouseItem } from '@/@types/interfaces'
import { ColumnsType } from 'antd/lib/table'
import { format } from 'date-fns'
import { Button, Row } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

export const WarehouseTableConfig = (
	onDelete: (id: string) => any,
): ColumnsType<IWarehouseItem> => {
	return [
		// {
		// 	title: '№',
		// 	key: 'key',
		// 	dataIndex: '_id',
		// },
		{
			title: 'Назва продукту',
			dataIndex: 'product',
			key: 'name',
			render: (product: IProduct) => {
				return product?.name
			},
		},
		{
			title: 'Ціна',
			dataIndex: 'price',
			key: 'price',
		},
		{
			title: 'Залишок',
			key: 'count',
			render: (_, record) => {
				return `${record.count} ${record.product?.measurmentUnit}`
			},
		},

		{
			title: 'Дата поступлення',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (_, record) => {
				return record.createdAt
					? format(new Date(record.createdAt), 'dd.MM.YYY')
					: null
			},
		},

		{
			title: 'Дії',
			key: 'actions',
			render: (_, record) => {
				return (
					<Row>
						<Button
							onClick={() => onDelete(record._id)}
							shape="circle"
							type="primary"
							size="small"
							style={{
								background: '#ff522b',
								borderColor: '#ff522b',
							}}
							icon={<DeleteOutlined />}
						/>
					</Row>
				)
			},
		},
	]
}
