import { IProduct } from '@/@types/interfaces'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Row } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { format } from 'date-fns'

interface Props {
	onPressDelete: (product: IProduct) => void
	onPressEdit: (product: IProduct) => void
}
export const ProductsTableConfig = ({
	onPressDelete,
	onPressEdit,
}: Props): ColumnsType<IProduct> => [
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
	{
		title: 'Дії',
		key: 'actions',
		render: (_, record) => {
			return (
				<Row>
					<Button
						onClick={() => onPressDelete(record)}
						shape="circle"
						type="primary"
						size="small"
						style={{
							background: '#ff522b',
							borderColor: '#ff522b',
							marginRight: 15,
						}}
						icon={<DeleteOutlined />}
					/>

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
