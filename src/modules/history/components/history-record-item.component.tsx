import React, { FC } from 'react'
import { IHistoryRecord } from '../typing'
import { createStyleSheet } from '@/shared/helpers'

interface Props extends IHistoryRecord {}

export const HistoryRecordItem: FC<Props> = ({}) => {
	return (
		<div style={styles.container}>
			<div style={styles.leftbar}></div>
			<div style={styles.body}></div>
		</div>
	)
}

const styles = createStyleSheet({
	container: {},
	leftbar: {},
	body: {},
})
