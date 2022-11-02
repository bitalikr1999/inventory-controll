import { createStyleSheet, prepareDateForDatePicker } from '@/shared/helpers'
import { Button, Col, DatePicker, Row } from 'antd'
import * as _ from 'lodash'
import { ZdoItemRow, ZdoItemTable } from '../../components'
import { useZdo } from '../../hooks'
import './style.css'
import locale from 'antd/es/date-picker/locale/uk_UA'
import { SelectGroupCategory } from '@/modules/childrens/components'

export const ZdoEditorPage = () => {
	const { items, changeDate, date, groupCategory, setGroupCategory } =
		useZdo()

	const generateZdo = () => {
		window.Main.emit('generateZdo', { items })
	}

	const renderItems = () => {
		return items.map(it => {
			return (
				<ZdoItemRow it={it}>
					<ZdoItemTable it={it} />
				</ZdoItemRow>
			)
		})
	}

	return (
		<div>
			<Row style={{ alignItems: 'center', marginBottom: 20 }}>
				<h1 style={styles.h1title}>ЗДО</h1>

				<DatePicker
					onChange={val => changeDate(val as any)}
					value={prepareDateForDatePicker(date)}
					picker="month"
					locale={locale}
					style={{ width: 150, marginRight: 15 }}
				/>

				<SelectGroupCategory
					val={groupCategory}
					onChange={setGroupCategory}
					style={{ width: 150, marginRight: 15 }}
				/>

				<Button type="primary" onClick={generateZdo}>
					Згенерувати excel файл
				</Button>
			</Row>

			<div style={styles.list}>{renderItems()}</div>
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
