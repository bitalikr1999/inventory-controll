import { RouteKey } from '@/@types/enums'
import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, Col, Row, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import { WarehouseTableConfig } from './table.config'

export const WarehouseListPage = () => {
	const navigate = useNavigate()

	return (
		<div>
			<Row align="middle" justify="start" style={{ marginBottom: 20 }}>
				<h1 style={{ marginBottom: 0 }}>Продукти</h1>
				<Button
					type="primary"
					icon={<AppstoreAddOutlined />}
					size="middle"
					style={{
						marginLeft: 15,
						backgroundColor: '#13cf74',
						borderColor: '#13cf74',
					}}
					onClick={() => navigate(RouteKey.WarehouseAdmission)}>
					Поступлення
				</Button>
			</Row>
			<Table dataSource={[]} columns={WarehouseTableConfig} />;
		</div>
	)
}
