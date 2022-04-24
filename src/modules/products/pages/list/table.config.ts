import { IProduct } from '@/@types/interfaces'
import { ColumnsType } from 'antd/lib/table'
import { format } from 'date-fns'

export const ProductsTableConfig: ColumnsType<IProduct> = [
	{
		title: '№',
		key: 'key',
		dataIndex: 'id',
	},
	{
		title: 'Назва',
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
		title: 'Дата створення',
		dataIndex: 'createdAt',
		key: 'createdAt',
		render: (_, record) => {
			return record.createdAt
				? format(new Date(record.createdAt), 'dd.MM.YYY')
				: null
		},
	},
]
