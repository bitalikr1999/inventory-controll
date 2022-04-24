import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, Drawer, Input, Select } from 'antd'
import { useState } from 'react'
import { createStyleSheet } from '@/shared/helpers'

import { validateProduct } from '../validator'
import { $eventVal } from '@/shared/helpers/form.helper'
import { useForm } from '@/shared/hooks/useForm'
import { useProducts } from '../hooks'

interface Form {
	name: string
	price: number
	measurmentUnit: string
}
export const AddProductModalSmart = () => {
	const [visible, setVisible] = useState(false)
	const form = useForm<Form>({}, validateProduct)
	const { items, set, getLastId } = useProducts()
	const [isLoading, setLoading] = useState()

	const showDrawer = () => {
		setVisible(true)
	}
	const onClose = () => {
		setVisible(false)
	}

	const submit = async () => {
		try {
			await set([
				...items,
				{
					...form.values,
					id: getLastId() + 1,
					createdAt: new Date(),
				},
			])
			onClose()
			form.set({} as any)
		} catch (e) {}
	}

	return (
		<>
			<Button
				type="primary"
				icon={<AppstoreAddOutlined />}
				size="middle"
				onClick={showDrawer}>
				Додати продукт
			</Button>
			<Drawer
				title="Створити продукт"
				placement="right"
				onClose={onClose}
				visible={visible}>
				<div className="form-block">
					<p className="form-label">Назва</p>
					<Input
						size="large"
						placeholder="Ковбаса"
						value={form.values.name}
						onChange={e => form.setField('name', $eventVal(e))}
					/>
				</div>
				<div className="form-block">
					<p className="form-label">Ціна</p>
					<Input
						size="large"
						placeholder="00.00"
						type="number"
						value={form.values.price}
						onChange={e => form.setField('price', $eventVal(e))}
					/>
				</div>
				<div className="form-block">
					<p className="form-label">Одиниця вимірювання</p>
					<Select
						showSearch
						style={{ width: '100%' }}
						placeholder="кг"
						optionFilterProp="children"
						size="large"
						value={form.values.measurmentUnit}
						onChange={val => form.setField('measurmentUnit', val)}
						filterOption={(input: string, option: any) =>
							option.children
								.toLowerCase()
								.indexOf(input.toLowerCase()) >= 0
						}>
						<Select.Option value="кг">кг</Select.Option>
						<Select.Option value="шт">шт</Select.Option>
						<Select.Option value="л">л</Select.Option>
						<Select.Option value="бух">бух</Select.Option>
						<Select.Option value="грам">грам</Select.Option>
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
