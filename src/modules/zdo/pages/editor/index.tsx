import { RouteKey } from '@/@types/enums'
import { PageHeader } from '@/shared/components/grid'
import { createStyleSheet } from '@/shared/helpers'
import { AppstoreAddOutlined, CaretDownOutlined } from '@ant-design/icons'
import { Button, Col, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import './style.css'

export const ZdoEditorPage = () => {
	const navigate = useNavigate()

	const renderItems = () => {
		return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(it => {
			return (
				<div style={styles.item}>
					<Row>
						<Col span={4}>
							<p style={{ ...styles.text, ...styles.title }}>
								Мясо куряче
							</p>
						</Col>
						<Col span={4}>
							<p style={styles.text}>Одиниця вимірювання: кг</p>
						</Col>
						<Col span={4}>
							<p style={styles.text}>Загальна вага: 10кг</p>
						</Col>
						<Col span={4}>
							<p style={styles.text}>Ціна: 10грн/кг</p>
						</Col>
						<Col span={4}>
							<p style={styles.text}>Сума: 100 грн.</p>
						</Col>
						<Col span={4} style={{ textAlign: 'right' }}>
							<Button
								type="primary"
								shape="circle"
								icon={<CaretDownOutlined />}
							/>
						</Col>
					</Row>
					<table className="zdo-item-table">
						<tr>
							<th>1</th>
							<th>2</th>
							<th>3</th>
							<th>4</th>
							<th>5</th>
							<th>6</th>
							<th>7</th>
							<th>8</th>
							<th>9</th>
							<th>10</th>
							<th>11</th>
							<th>12</th>
							<th>13</th>
							<th>14</th>
							<th>15</th>
							<th>16</th>
							<th>17</th>
							<th>18</th>
							<th>19</th>
							<th>20</th>
							<th>21</th>
							<th>22</th>
							<th>23</th>
							<th>24</th>
							<th>25</th>
							<th>26</th>
							<th>27</th>
							<th>28</th>
							<th>29</th>
							<th>30</th>
						</tr>
						<tr>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td>4</td>
							<td>5</td>
							<td>6</td>
							<td>7</td>
							<td>8</td>
							<td>9</td>
							<td>10</td>
							<td>11</td>
							<td>12</td>
							<td>13</td>
							<td>14</td>
							<td>15</td>
							<td>16</td>
							<td>17</td>
							<td>18</td>
							<td>19</td>
							<td>20</td>
							<td>21</td>
							<td>22</td>
							<td>1</td>
							<td>2</td>
							<td>1</td>
							<td>2</td>
							<td>1</td>
							<td>2</td>
							<td>1</td>
							<td>2</td>
						</tr>
					</table>
				</div>
			)
		})
	}

	return (
		<div>
			<PageHeader
				title={`ЗДО`}
				rightComponent={
					<Button
						type="primary"
						icon={<AppstoreAddOutlined />}
						size="middle"
						onClick={() => navigate(RouteKey.MenuEditor)}>
						Створити
					</Button>
				}
			/>

			<div style={styles.list}>{renderItems()}</div>
		</div>
	)
}

const styles = createStyleSheet({
	list: {
		paddingBottom: 100,
	},
	item: {
		border: '1px solid rgba(0,0,0,.1)',
		borderRadius: 12,
		padding: 15,
		marginBottom: 10,
	},
	title: {
		marginBottom: 0,
		fontSize: 14,
		fontWeight: 'bold',
	},
	text: {
		marginBottom: 0,
		fontSize: 14,
	},
	table: {
		width: '100%',
		border: '1px solid rgba(0,0,0,.1)',
		borderCollapse: 'collapse',
	},
})
