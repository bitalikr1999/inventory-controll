import { GroupCategoryKey } from '@/@types/enums'
import { IChildren, IGroup } from '@/@types/interfaces'
import { FormControll } from '@/shared/components/form'
import { createStyleSheet } from '@/shared/helpers'
import { $eventVal } from '@/shared/helpers/form.helper'
import { useForm } from '@/shared/hooks/useForm'
import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, DatePicker, Drawer, Input, Select } from 'antd'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { FC, useEffect, useState } from 'react'

interface Props {
	existData?: IChildren
	groupId: string
	onSubmit: (data: Form) => void
}

interface Form {
	name: string
	birthday: any
	paymentPercent: number
	halfPaymentReason: string
}

const initialForm = {
	birthday: moment().subtract(6, 'years').toISOString(),
	paymentPercent: 100,
}

export const ChildrenEditor: FC<Props> = ({ existData, onSubmit }) => {
	const [visible, setVisible] = useState(false)
	const form = useForm<Form>(cloneDeep(initialForm), () => null)

	useEffect(() => {
		if (existData) {
			form.set(existData as any)
			setVisible(true)
		} else {
			form.set(cloneDeep(initialForm) as any)
		}
	}, [existData])

	const close = () => {
		setVisible(false)
		form.set(cloneDeep(initialForm) as any)
	}

	const submit = () => {
		onSubmit(form.values)
		close()
		form.set(cloneDeep(initialForm) as any)
	}

	return (
		<>
			<Button
				type="primary"
				icon={<AppstoreAddOutlined />}
				size="middle"
				onClick={() => setVisible(true)}>
				Додати учасника
			</Button>
			<Drawer
				title="Створити групу"
				placement="right"
				onClose={close}
				visible={visible}>
				<FormControll
					label="ФІО"
					size="large"
					placeholder="Прізвище Імя По-батькові"
					value={form.values.name}
					onChangeVal={val => form.setField('name', val)}
				/>

				<FormControll
					label="Сума оплати"
					size="large"
					placeholder="100"
					value={form.values.paymentPercent}
					onChangeVal={val => form.setField('paymentPercent', val)}
					prefix="%"
				/>

				{form.values.paymentPercent < 100 ? (
					<FormControll
						label="Причина часткової оплати"
						size="large"
						placeholder=""
						value={form.values.halfPaymentReason}
						onChangeVal={val =>
							form.setField('halfPaymentReason', val)
						}
					/>
				) : null}

				<div className="form-block">
					<p className="form-label">День народження</p>
					<DatePicker
						style={{ width: '100%' }}
						value={moment(form.values.birthday)}
						onChange={val =>
							form.setField('birthday', val.toISOString())
						}
						size="large"
					/>
				</div>

				<Button
					type="primary"
					size="large"
					style={styles.button}
					onClick={() => form.onSubmit(submit)}>
					Зберегти
				</Button>
			</Drawer>
		</>
	)
}

const styles = createStyleSheet({
	button: {
		width: '100%',
		marginTop: 10,
	},
})
