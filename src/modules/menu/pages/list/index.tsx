import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, Col, Row, Table } from 'antd'

export const MenuListPage = () => {
	return (
		<div>
			<Row align="middle">
				<Col span={16}>
					<h1>Меню</h1>
				</Col>
				<Col span={8} className="col-right">
					<Button
						type="primary"
						icon={<AppstoreAddOutlined />}
						size="middle">
						Створити
					</Button>
				</Col>
			</Row>
			{/* <Table dataSource={list} columns={ProductsTableConfig} />; */}
		</div>
	)
}
