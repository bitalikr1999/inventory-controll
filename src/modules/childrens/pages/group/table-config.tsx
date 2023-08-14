import { IChildren, IProduct } from '@/@types/interfaces'
import { EditOutlined } from '@ant-design/icons'
import { Button, Row } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { format } from 'date-fns'
import { defaultTo } from 'lodash'
import moment from 'moment'

interface Props {
	onPressEdit: (children: IChildren) => void
}

export const ChildrensTableConfig = ({
	onPressEdit,
}: Props): ColumnsType<IChildren> => [
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
		title: 'Сума оплати',
		dataIndex: 'paymentPercent',
		key: 'paymentPercent',
		render: value => {
			return `${defaultTo(value, 100)}%`
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

	{
		title: 'Дії',
		key: 'actions',
		render: (_, record) => {
			return (
				<Row>
					<Button
						onClick={() => onPressEdit(record)}
						shape="circle"
						type="primary"
						size="small"
						style={{
							background: '#1890ff',
							borderColor: '#1890ff',
						}}
						icon={<EditOutlined />}
					/>
				</Row>
			)
		},
	},
]
