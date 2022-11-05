import { ZdoItem } from '@/@types/interfaces/entities/zdo'
import _ from 'lodash'
import { FC } from 'react'

interface ZdoItemTableProps {
	it: ZdoItem
	daysCount: number
}

export const ZdoItemTable: FC<ZdoItemTableProps> = ({ it, daysCount }) => {
	const getDayIt = (day: number): any => {
		const result = it.byDays.find(it => it.date === day)
		return _.defaultTo(result, {})
	}

	return (
		<table className="zdo-item-table">
			<tr>
				<th>Дата</th>
				{Array.from({ length: daysCount }, (_, i) => {
					return <th>{i + 1}</th>
				})}
			</tr>
			<tr>
				<td>Вага</td>
				{Array.from({ length: daysCount }, (_, i) => {
					return <td>{getDayIt(i + 1).count}</td>
				})}
			</tr>
			<tr>
				<td>Ціна</td>
				{Array.from({ length: daysCount }, (_, i) => {
					const dayIt = getDayIt(i + 1)
					const sum = dayIt?.count * it.product?.price
					return <td>{sum ? sum : 0}</td>
				})}
			</tr>
		</table>
	)
}
