import { PageHeader } from '@/shared/components/grid'
import { createStyleSheet, prepareDateForDatePicker } from '@/shared/helpers'
import { Button, Checkbox, DatePicker, Row } from 'antd'
import locale from 'antd/es/date-picker/locale/uk_UA'
import moment from 'moment'
import React, { useState } from 'react'

import { useLocation } from 'react-router-dom'
import { useChildrenGroup } from '../../hooks'

export const GroupCalendar = () => {
	const location: any = useLocation()
	const [date, setDate] = useState(new Date())
	const { group } = useChildrenGroup(location.state?._id)
	const daysCount = moment(new Date(date)).daysInMonth()

	const renderTr = () => {
		return group?.childrens.map(it => {
			return (
				<tr>
					<td style={{ fontSize: 14 }}>{it.name}</td>
					{Array.from({ length: daysCount }, (_, i) => {
						return (
							<th>
								<Checkbox defaultChecked={true} />
							</th>
						)
					})}
				</tr>
			)
		})
	}

	return (
		<div>
			<Row style={{ alignItems: 'center', marginBottom: 20 }}>
				<h1 style={styles.h1title}>
					Журнал відвідувань, група {group?.name}
				</h1>

				<DatePicker
					onChange={val => setDate(val as any)}
					value={prepareDateForDatePicker(date)}
					picker="month"
					locale={locale}
					style={{ width: 150, marginRight: 15 }}
				/>

				<Button type="primary" onClick={() => {}}>
					Зберегти
				</Button>
			</Row>

			<table className="zdo-item-table">
				<tr>
					<th style={{ width: 160 }}></th>
					{Array.from({ length: daysCount }, (_, i) => {
						return <th>{i + 1}</th>
					})}
				</tr>
				{renderTr()}
			</table>
		</div>
	)
}

const styles = createStyleSheet({
	h1title: {
		marginBottom: 0,
		marginRight: 30,
	},
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
