import { GroupCategoryKey } from '@/@types/enums'
import { IGroup } from '@/@types/interfaces'
import { FormControll } from '@/shared/components/form'
import { createStyleSheet } from '@/shared/helpers'
import { $eventVal } from '@/shared/helpers/form.helper'
import { useForm } from '@/shared/hooks/useForm'
import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, Drawer, Input, Select } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useChildrensGroups } from '../hooks'

interface Props {
	existData?: IGroup
	onPressClose?: () => void
}

interface Form {
	name: string
	category: GroupCategoryKey

	reportCardTitle?: string
}

export const GroupEditorSmart: FC<Props> = ({ existData, onPressClose }) => {
	const { data, set, update } = useChildrensGroups()
	const [visible, setVisible] = useState(false)
	const form = useForm<Form>({}, () => null)
	const mod = existData ? 'edit' : 'create'

	useEffect(() => {
		if (existData) {
			setVisible(true)
			form.set(existData)
		}
	}, [existData])

	const close = () => {
		setVisible(false)
		onPressClose()
	}

	const submit = async () => {
		try {
			if (mod === 'edit') {
				await update({
					_id: existData._id,
					...form.values,
				})
			} else {
				await set(form.values)
			}
			close()
			form.set({} as any)
		} catch (e) {}
	}
	return (
		<>
			<Button
				type="primary"
				icon={<AppstoreAddOutlined />}
				size="middle"
				onClick={() => setVisible(true)}>
				Створити
			</Button>
			<Drawer
				title="Створити групу"
				placement="right"
				onClose={close}
				visible={visible}>
				<FormControll
					label="Назва"
					size="large"
					placeholder="Молодша група"
					value={form.values.name}
					onChangeVal={val => form.setField('name', val)}
				/>

				<div className="form-block">
					<p className="form-label">Категорія</p>
					<Select
						style={{ width: '100%' }}
						placeholder="1-4 р."
						size="large"
						value={form.values.category}
						onChange={val => form.setField('category', val)}>
						<Select.Option value={GroupCategoryKey.Junior}>
							1-4 p.
						</Select.Option>
						<Select.Option value={GroupCategoryKey.Middle}>
							4-6 p.
						</Select.Option>
						<Select.Option value={GroupCategoryKey.Senior}>
							Працівники
						</Select.Option>
					</Select>
				</div>

				<FormControll
					label="Табель щоденного харчування"
					size="large"
					placeholder="дітей групи раннього віку № 1"
					value={form.values.reportCardTitle}
					onChangeVal={val => form.setField('reportCardTitle', val)}
				/>

				<Button
					type="primary"
					size="large"
					style={styles.button}
					onClick={() => form.onSubmit(submit)}>
					Створити
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
