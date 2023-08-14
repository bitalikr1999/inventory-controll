import React, { useState } from 'react'
import { PageHeader } from '@/shared/components/grid'
import { prepareDateForDatePicker } from '@/shared/helpers'
import { AppstoreAddOutlined, PrinterOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Row } from 'antd'
import locale from 'antd/es/date-picker/locale/uk_UA'
import { RouteKey } from '@/@types/enums'
import { useNavigate } from 'react-router-dom'
import { SelectGroupCategory } from '@/modules/childrens/components'
import _ from 'lodash'
import { TimesheetCardComponent } from '../../components'

export const VisitingListPage = () => {
	const navigate = useNavigate()
	const [date, setDate] = useState(new Date())
	const [groupCategory, setGroupCategory] = useState<string>()

	const [data] = useState([1, 2, 3, 4, 5, 6])

	const renderItems = () => {
		if (_.isEmpty(data)) return null
		return (
			data
				// .sort(
				// 	(a, b) =>
				// 		new Date(a.date).getTime() - new Date(b.date).getTime(),
				// )
				.map(it => {
					return (
						<Col span={8} style={{ padding: 10 }}>
							<TimesheetCardComponent />
						</Col>
					)
				})
		)
	}

	return (
		<>
			<PageHeader
				title={`Відвідування`}
				rightComponent={
					<>
						<SelectGroupCategory
							val={groupCategory}
							onChange={setGroupCategory}
							style={{ width: 150, marginRight: 15 }}
						/>
						<DatePicker
							onChange={val => setDate(val as any)}
							value={prepareDateForDatePicker(date)}
							picker="month"
							locale={locale}
							style={{ minWidth: 150, marginRight: 15 }}
						/>
						<Button
							type="primary"
							icon={<AppstoreAddOutlined />}
							size="middle"
							style={{ marginRight: 15 }}
							onClick={() => navigate(RouteKey.VisitingEditor)}>
							Створити
						</Button>
						<Button
							type="primary"
							icon={<PrinterOutlined />}
							size="middle"
							style={{
								backgroundColor: '#52c41a',
								borderColor: '#52c41a',
							}}
							onClick={() => {}}>
							Згенерувати XLSX
						</Button>
					</>
				}
			/>

			<Row>{renderItems()}</Row>
		</>
	)
}
