import { IChildren, IProduct } from '@/@types/interfaces'
import { ColumnsType } from 'antd/lib/table'
import { format } from 'date-fns'
import moment from 'moment'

export const ChildrensTableConfig: ColumnsType<IChildren> = [
	{
		title: 'ФІО',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: 'Вік',
		dataIndex: 'birthday',
		key: 'age',
		render: value => {
			return moment().diff(new Date(value), 'years')
		},
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
