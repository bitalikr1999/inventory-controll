import { IWarehouseItem } from '@/@types/interfaces'
import { ColumnsType } from 'antd/lib/table'
import { format } from 'date-fns'

export const WarehouseTableConfig: ColumnsType<IWarehouseItem> = [
	{
		title: '№',
		key: 'key',
		dataIndex: 'id',
	},
	{
		title: 'Назва продукту',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: 'Ціна',
		dataIndex: 'price',
		key: 'price',
	},
	{
		title: 'Одинииця вимірювання',
		dataIndex: 'measurmentUnit',
	},
	{
		title: 'Залишок',
		dataIndex: 'count',
	},
	{
		title: 'Початкова кількість',
		dataIndex: 'defaultCount',
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
]
