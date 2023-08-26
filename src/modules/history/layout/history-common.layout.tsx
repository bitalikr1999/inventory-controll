import { Row } from 'antd'
import React, { FC, PropsWithChildren } from 'react'

interface Props {
	title: string
}

export const HistoryCommonLayout: FC<PropsWithChildren<Props>> = ({
	title,
	children,
}) => {
	return (
		<div>
			<Row align="middle" justify="start" style={{ marginBottom: 20 }}>
				<h1 style={{ marginBottom: 0 }}>{title}</h1>
			</Row>

			{children}
		</div>
	)
}
