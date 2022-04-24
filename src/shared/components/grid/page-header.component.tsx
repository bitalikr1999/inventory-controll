import { createStyleSheet } from '@/shared/helpers'
import { ArrowLeftOutlined, BackwardOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
	title: string
	rightComponent?: any
	showBack?: boolean
}

export const PageHeader: FC<PageHeaderProps> = ({
	title,
	rightComponent,
	showBack,
}) => {
	const navigate = useNavigate()
	return (
		<Row align="middle" style={styles.container}>
			<Col span={16} style={styles.row}>
				{showBack ? (
					<ArrowLeftOutlined
						style={styles.back}
						onClick={() => navigate(-1)}
					/>
				) : null}
				<h1 style={styles.title}>{title}</h1>
			</Col>
			<Col span={8} className="col-right">
				{rightComponent}
			</Col>
		</Row>
	)
}

const styles = createStyleSheet({
	container: {
		marginBottom: 20,
	},
	back: {
		fontSize: 24,
		marginRight: 20,
		cursor: 'pointer',
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	title: {
		marginBottom: 0,
	},
})
