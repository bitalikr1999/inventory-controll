import { RouteKey } from '@/@types/enums'
import { IProduct } from '@/@types/interfaces'
import { PageHeader } from '@/shared/components/grid'
import { useStoreDate } from '@/shared/hooks'
import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, Col, Row, Table } from 'antd'
import { useNavigate } from 'react-router-dom'

export const ZdoListPage = () => {
	const navigate = useNavigate()

	return (
		<div>
			<PageHeader
				title={`ЗДО`}
				rightComponent={
					<Button
						type="primary"
						icon={<AppstoreAddOutlined />}
						size="middle"
						onClick={() => navigate(RouteKey.ZdoEditor)}>
						Створити
					</Button>
				}
			/>
		</div>
	)
}
