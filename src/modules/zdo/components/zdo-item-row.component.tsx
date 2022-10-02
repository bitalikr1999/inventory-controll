import { ZdoItem } from '@/@types/interfaces/entities/zdo'
import { createStyleSheet } from '@/shared/helpers'
import { CaretDownOutlined } from '@ant-design/icons'
import { Button, Col, Row } from 'antd'
import { FC, useState } from 'react'

interface ZdoItemProps {
	it: ZdoItem
	children: any
}
export const ZdoItemRow: FC<ZdoItemProps> = ({ it, children }) => {
	const [showContent, setShowContent] = useState(false)

	return (
		<div style={styles.item}>
			<Row>
				<Col span={4}>
					<p style={{ ...styles.text, ...styles.title }}>
						{it.product.name}
					</p>
				</Col>
				<Col span={5}>
					<p style={styles.text}>
						Одиниця: {it.product.measurmentUnit}
					</p>
				</Col>
				<Col span={5}>
					<p style={styles.text}>
						Кількість: {it.totalCount} {it.product.measurmentUnit}
					</p>
				</Col>
				<Col span={4}>
					<p style={styles.text}>
						Ціна: {it.product.price} грн/
						{it.product.measurmentUnit}
					</p>
				</Col>
				<Col span={4}>
					<p style={styles.text}>Сума: {it.totalPrice} грн.</p>
				</Col>
				<Col span={2} style={{ textAlign: 'right' }}>
					<Button
						type="primary"
						shape="circle"
						icon={<CaretDownOutlined />}
						onClick={() => setShowContent(!showContent)}
					/>
				</Col>
			</Row>

			{showContent ? children : null}
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
