import React, { FC, useMemo } from 'react'
import { IHistoryRecord } from '../typing'

interface Props {
	ItemComponent: React.FC<IHistoryRecord>

	items: IHistoryRecord[]
}

export const HistoryRecordsList: FC<Props> = ({ ItemComponent, items }) => {
	const listComponents = useMemo(() => {
		return items.map(it => <ItemComponent key={it.id} {...it} />)
	}, [items])

	return <div>{listComponents}</div>
}
