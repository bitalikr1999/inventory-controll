import React, { FC } from 'react'
import { HistoryCommonLayout } from '../layout'
import { IHistoryRecord } from '../typing'
import { HistoryRecordItem, HistoryRecordsList } from '../components'

interface Props {
	title: string

	records: IHistoryRecord[]
}

export const HistoryPageTemplate: FC<Props> = ({ title, records }) => {
	return (
		<HistoryCommonLayout title={title}>
			<HistoryRecordsList
				items={records}
				ItemComponent={HistoryRecordItem}
			/>
		</HistoryCommonLayout>
	)
}
