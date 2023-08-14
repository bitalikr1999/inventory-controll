import { PageHeader } from '@/shared/components/grid'
import { createStyleSheet, prepareDateForDatePicker } from '@/shared/helpers'
import { Button, Checkbox, DatePicker, Row, message } from 'antd'
import locale from 'antd/es/date-picker/locale/uk_UA'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'
import { useChildrenGroup, useChildrenGroupCalendar } from '../../hooks'
import { IChildrenCalendarRecord } from '@/@types/interfaces'
import _ from 'lodash'

export const GroupCalendar = () => {
	const location: any = useLocation()
	const [date, setDate] = useState(new Date())
	const { group } = useChildrenGroup(location.state?._id)
	const daysCount = moment(new Date(date)).daysInMonth()
	const [items, setItems] = useState<IChildrenCalendarRecord['items']>([])
	const { calendar, fetch, getDateKey } = useChildrenGroupCalendar()

	useEffect(() => {
		if (date && group) fetch(group._id, getDateKey(date))
	}, [date, group])

	useEffect(() => {
		if (calendar) {
			setItems(calendar.items)
		} else {
			setItems([])
		}
	}, [calendar])

	const getIsVisiting = (childId: string, day: number) => {
		const child = items.find(it => it.childId === childId)
		if (!child) return false

		const visit = child.visiting.find(it => it.day === day)
		return Boolean(visit?.isPresent)
	}

	const onChange = (childId: string, day: number, isPresent: boolean) => {
		const result = _.cloneDeep(items)

		let childIndex = result.findIndex(it => it.childId === childId)
		if (childIndex < 0) {
			result.push({
				childId,
				visiting: [],
			})
			childIndex = result.findIndex(it => it.childId === childId)
		}
		const child = result[childIndex]
		let visitingIndex = child.visiting.findIndex(it => it.day === day)

		if (visitingIndex < 0) {
			result[childIndex].visiting.push({
				isPresent: isPresent,
				day,
			})
		} else {
			result[childIndex].visiting[visitingIndex].isPresent = isPresent
		}

		setItems(result)
	}

	const submit = async () => {
		await window.Main.emit('putChildrenGroupCalendar', {
			groupId: group._id,
			date: getDateKey(date),
			items,
		})
		message.success('Данні успішно збережені')
	}

	const renderTr = () => {
		return group?.childrens.map(it => {
			return (
				<tr>
					<td style={{ fontSize: 14 }}>{it.name}</td>
					{Array.from({ length: daysCount }, (_, i) => {
						const day = i + 1
						return (
							<th>
								<Checkbox
									defaultChecked={true}
									checked={getIsVisiting(it._id, day)}
									onChange={e =>
										onChange(it._id, day, e.target.checked)
									}
								/>
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
					onChange={val => setDate(val.toDate())}
					value={prepareDateForDatePicker(date)}
					picker="month"
					locale={locale}
					style={{ width: 150, marginRight: 15 }}
				/>

				<Button type="primary" onClick={() => submit()}>
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
