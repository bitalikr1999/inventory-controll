import React, { FC } from 'react'
import { IHistoryRecord } from '../typing'
import { createStyleSheet } from '@/shared/helpers'
import { HistoryRecordType } from '@/@types/enums'
import { FallOutlined, RiseOutlined } from '@ant-design/icons'

interface Props extends IHistoryRecord {}

export const HistoryRecordItem: FC<Props> = ({
	title,
	description,
	createdAt,
	type,
}) => {
	return (
		<div style={styles.container}>
			<div style={styles.leftbar}>
				<p style={styles.title}>
					{title}

					<span style={styles.type}>
						{type === HistoryRecordType.Income ? (
							<RiseOutlined style={{ color: 'green' }} />
						) : (
							<FallOutlined style={{ color: 'red' }} />
						)}
					</span>
				</p>
			</div>
			<div style={styles.body}>
				<p dangerouslySetInnerHTML={{ __html: description }}></p>
			</div>

			<div style={styles.rightbar}>{createdAt}</div>
		</div>
	)
}

const styles = createStyleSheet({
	container: {
		border: '1px solid rgba(0,0,0,.1)',
		borderRadius: 10,
		padding: 10,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	leftbar: {
		marginRight: 20,
	},
	body: {
		flex: 1,
	},

	title: {
		fontSize: 20,
		margin: 0,
	},
	description: {
		fontSize: 14,
		lineHeight: 1.4,
		margin: 0,
	},

	rightbar: {},

	type: {
		marginLeft: 10,
	},
})
