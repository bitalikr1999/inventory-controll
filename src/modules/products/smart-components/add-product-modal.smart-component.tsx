import { AppstoreAddOutlined } from '@ant-design/icons'
import { Button, Drawer, Input, Select } from 'antd'
import { FC, useEffect, useState } from 'react'
import { createStyleSheet } from '@/shared/helpers'

import { validateProduct } from '../validator'
import { $eventVal } from '@/shared/helpers/form.helper'
import { useForm } from '@/shared/hooks/useForm'
import { useProducts } from '../hooks'
import { MeasurmentUnit, ProductCategory } from '@/@types/enums'
import { IProduct } from '@/@types/interfaces'
import { cloneDeep, cloneDeepWith } from 'lodash'

interface Form {
	name: string
	price: number
	measurmentUnit: MeasurmentUnit
	category: ProductCategory
}

interface Props {
	existProduct?: IProduct
}
export const AddProductModalSmart: FC<Props> = ({ existProduct }) => {
	const [visible, setVisible] = useState(false)
	const form = useForm<Form>({}, validateProduct)
	const { items, set, getLastId } = useProducts()

	useEffect(() => {
		if (existProduct) {
			form.set({
				name: existProduct.name,
				price: existProduct.price,
				measurmentUnit: existProduct.measurmentUnit,
				category: existProduct.category,
			})
			showDrawer()
		}
	}, [existProduct])

	const showDrawer = () => {
		setVisible(true)
	}
	const onClose = () => {
		setVisible(false)
	}

	const update = async () => {
		const _items = cloneDeep(items)

		_items.forEach((it, i) => {
			if (it.id === existProduct.id) {
				_items[i] = {
					...it,
					...form.values,
				}
			}
		})

		await set(_items)
	}

	const add = async () => {
		await set([
			...items,
			{
				...form.values,
				id: getLastId() + 1,
				createdAt: new Date(),
			},
		])
	}

	const submit = async () => {
		try {
			if (existProduct) await update()
			else add()
			onClose()
			form.set({} as any)
		} catch (e) {
			console.log('error', e)
		}
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

				<div className="form-block">
					<p className="form-label">Категорія</p>
					<Select
						showSearch
						style={{ width: '100%' }}
						placeholder="Категорія"
						optionFilterProp="children"
						size="large"
						value={form.values.category}
						onChange={val => form.setField('category', val)}
						filterOption={(input: string, option: any) =>
							option.children
								.toLowerCase()
								.indexOf(input.toLowerCase()) >= 0
						}>
						<Select.Option value={ProductCategory.Meat}>
							Мясо
						</Select.Option>
						<Select.Option value={ProductCategory.Cereals}>
							Крупи
						</Select.Option>
						<Select.Option value={ProductCategory.Fish}>
							Риба
						</Select.Option>
						<Select.Option value={ProductCategory.Fruits}>
							Фрукти
						</Select.Option>
						<Select.Option value={ProductCategory.Meat}>
							Мясо
						</Select.Option>
						<Select.Option value={ProductCategory.Milk}>
							Молоко
						</Select.Option>
						<Select.Option value={ProductCategory.Mushrooms}>
							Грииби
						</Select.Option>
						<Select.Option value={ProductCategory.Vegetables}>
							Овочі
						</Select.Option>
						<Select.Option value={ProductCategory.Groceries}>
							Бакалія
						</Select.Option>
					</Select>
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
