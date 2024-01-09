import { PageHeader } from '@/shared/components/grid'
import {
	$eventVal,
	createStyleSheet,
	prepareDateForDatePicker,
} from '@/shared/helpers'
import { Button, Checkbox, DatePicker, Input, Row, Select, message } from 'antd'
import locale from 'antd/es/date-picker/locale/uk_UA'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'
import { useChildrenGroup, useChildrenGroupCalendar } from '../../hooks'
import { IChildren, IChildrenCalendarRecord } from '@/@types/interfaces'
import _ from 'lodash'
import { childrensCalendarsAPI } from '../../api/childrens-calendars.api'

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

	const getPaymentPercent = (childId: string) => {
		const child = items.find(it => it.childId === childId)

		if (!child) {
			const defaultPercent = group.childrens.find(
				it => it._id === childId,
			)?.paymentPercent

			onChangePaymentPercent(childId, defaultPercent)
		} else return Number(child.paymentPercent)
	}
	const findCalendarChild = (childId: string) => {
		const result = _.cloneDeep(items)
		let childIndex = result.findIndex(it => it.childId === childId)
		if (childIndex < 0) {
			result.push({
				childId,
				visiting: [],
			})
			childIndex = result.findIndex(it => it.childId === childId)
		}
		return { result, childIndex }
	}

	const onChange = (childId: string, day: number, isPresent: boolean) => {
		const { result, childIndex } = findCalendarChild(childId)

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

	function onChangePaymentPercent(childId: string, percent: number) {
		console.log(childId, percent)
		const { result, childIndex } = findCalendarChild(childId)
		result[childIndex].paymentPercent = percent
		setItems(result)
	}

	const submit = async () => {
		await childrensCalendarsAPI.put({
			groupId: group._id,
			date: getDateKey(date),
			items,
		})
		message.success('Данні успішно збережені')
	}

	const renderTr = () => {
		return group?.childrens
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(renderChildRow)
	}

	function renderChildRow(child: IChildren) {
		const cols = renderChildRowCols(child)

		cols.push(
			<th>
				<Select
					value={getPaymentPercent(child._id)}
					style={{ width: 100 }}
					options={[
						{ value: 0, label: '0%' },
						{ value: 50, label: '50%' },
						{ value: 100, label: '100%' },
					]}
					onChange={val => onChangePaymentPercent(child._id, val)}
				/>
			</th>,
		)

		return (
			<tr>
				<td style={{ fontSize: 14 }}>{child.name}</td>
				{cols}
			</tr>
		)
	}

	function renderChildRowCols(child: IChildren) {
		return Array.from({ length: daysCount }, (_, i) => {
			const day = i + 1
			return renderChildRowCol(child, day)
		})
	}

	function renderChildRowCol(child: IChildren, day: number) {
		return (
			<th>
				<Checkbox
					defaultChecked={true}
					checked={getIsVisiting(child._id, day)}
					onChange={e => onChange(child._id, day, e.target.checked)}
				/>
			</th>
		)
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
					<th style={{ width: 110 }}>Оплата ( від 60% )</th>
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
