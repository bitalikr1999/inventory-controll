import { GroupCategoryKey } from '@/@types/enums'
import { IGroup } from '@/@types/interfaces'
import { FormControll } from '@/shared/components/form'
import { createStyleSheet } from '@/shared/helpers'
import { $eventVal } from '@/shared/helpers/form.helper'
import { useForm } from '@/shared/hooks/useForm'
import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, DatePicker, Drawer, Input, Select } from 'antd'
import moment from 'moment'
import { FC, useState } from 'react'

interface Props {
	existData?: IGroup
	groupId: string
	onSubmit: (data: Form) => void
}

interface Form {
	name: string
	birthday: any
}

export const ChildrenEditor: FC<Props> = ({ existData, onSubmit }) => {
	const [visible, setVisible] = useState(false)
	const form = useForm<Form>(
		{
			birthday: moment().subtract(6, 'years').toISOString(),
		},
		() => null,
	)

	const close = () => setVisible(false)

	const submit = () => {
		onSubmit(form.values)
		close()
		form.set({} as any)
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
					Додати
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
