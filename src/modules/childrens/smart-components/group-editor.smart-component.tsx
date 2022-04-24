import { GroupCategoryKey } from '@/@types/enums'
import { IGroup } from '@/@types/interfaces'
import { FormControll } from '@/shared/components/form'
import { createStyleSheet } from '@/shared/helpers'
import { $eventVal } from '@/shared/helpers/form.helper'
import { useForm } from '@/shared/hooks/useForm'
import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, Drawer, Input, Select } from 'antd'
import { FC, useState } from 'react'
import { useChildrensGroups } from '../hooks'

interface Props {
	existData?: IGroup
}

interface Form {
	name: string
	category: GroupCategoryKey
}

export const GroupEditorSmart: FC<Props> = ({ existData }) => {
	const { data, set } = useChildrensGroups()
	const [visible, setVisible] = useState(false)
	const form = useForm<Form>({}, () => null)

	const close = () => setVisible(false)

	const submit = () => {
		try {
			set(form.values)
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
