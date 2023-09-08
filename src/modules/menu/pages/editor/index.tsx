import _, { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { RouteKey } from '@/@types/enums'
import { SelectGroupCategory } from '@/modules/childrens/components'
import { PageBackBtn } from '@/shared/components/grid'
import { createStyleSheet, prepareDateForDatePicker } from '@/shared/helpers'
import { useForm } from '@/shared/hooks/useForm'
import { Button, Col, DatePicker, Input, Row } from 'antd'

import { ItemEditor } from '../../atoms/item-editor.atom'
import { MenuTabAtom } from '../../atoms/menu-tab.atom'
import { useChildrenCount, useMenus } from '../../hooks'
import { MenuEditorForm, MenuItemPeriod } from '../../interfaces'
import { LoadingOutlined } from '@ant-design/icons'
import { IMenu } from '@/@types/interfaces'
const randomstring = require('randomstring')

const formInitialState: Partial<MenuEditorForm> = {
	items: [],
	date: new Date(),
}

export const MenuEditorPage = () => {
	const navigate = useNavigate()
	const location: any = useLocation()
	const existId = location.state?.id
	const copyId = location.state?.copyId

	const form = useForm<MenuEditorForm>(
		cloneDeep(formInitialState),
		() => null,
	)
	const [selectedItemId, selectItemId] = useState<string>()
	const { set, getOne } = useMenus({})

	const { count, isLoading } = useChildrenCount(
		form.values?.date,
		form.values?.groupCategory,
	)

	const loadExist = async () => {
		const menu = await getOne(existId)
		if (menu) form.set(menu)
	}

	useEffect(() => {
		if (existId) loadExist()
	}, [existId])

	const createFromCopy = async () => {
		const menu: IMenu = await getOne(copyId)

		menu.dateGroupKey = null
		menu.groupCategory = null

		menu.items = menu.items.map(item => {
			item.products = item.products.map(it => {
				return {
					...it,
					count: null,
				}
			})

			return item
		})

		form.set(menu as any)
	}

	useEffect(() => {
		if (copyId) createFromCopy()
	}, [copyId])

	const addItem = (period: MenuItemPeriod) => {
		const items = [...form.values.items]
		const id = randomstring.generate(12)
		items.push({
			id,
			name: '',
			period,
			weight: '0',
			products: [],
		})

		form.setField('items', items)
		selectItemId(id)
	}

	const items = useMemo(() => {
		const _items = _.defaultTo(form.values.items, [])

		return _items.reduce(
			(res, item) => {
				res[item.period].push(item)
				return res
			},
			{
				mornin: [],
				dinner: [],
				supper: [],
			},
		)
	}, [form.values.items])

	const selectedItem = useMemo(() => {
		const _items = _.defaultTo(form.values.items, [])
		return _items.find(it => it.id === selectedItemId)
	}, [selectedItemId, form.values.items])

	const addProduct = () => {
		const items = [...form.values.items]
		const item = items.findIndex(it => it.id === selectedItemId)

		if (!items[item].products) items[item].products = []
		items[item].products.push({
			id: randomstring.generate(12),
			product: null,
			count: 0,
		})

		form.setField('items', _.cloneDeep(items))
	}

	const save = async () => {
		const { values } = form

		try {
			await set({
				id: _.defaultTo(existId, null),
				name: values.title,
				childrensCount: Number(count),
				date: new Date(values.date).toISOString(),
				items: values.items,
				groupCategory: values.groupCategory,
			})
		} catch (e) {
			console.log('error', e)
		} finally {
			navigate(RouteKey.Menu)
		}
	}

	const removeItem = (id: string) => {
		const items = [...form.values.items].filter(it => it.id !== id)
		form.setField('items', items)
	}

	return (
		<div>
			<PageBackBtn />
			<Row style={{ alignItems: 'center', marginBottom: 20 }}>
				<h1 style={styles.title}>Створення меню</h1>

				<SelectGroupCategory
					val={form.values.groupCategory}
					onChange={val => form.setField('groupCategory', val)}
					style={{ width: 150, marginRight: 15 }}
				/>
				<Input
					placeholder="Кількість дітей"
					value={count}
					prefix="Кількість дітей: "
					disabled={true}
					style={{ width: 180, marginRight: 15 }}
					suffix={isLoading ? <LoadingOutlined /> : null}
				/>

				<DatePicker
					onChange={(val: any) => form.setField('date', val.toDate())}
					value={prepareDateForDatePicker(form.values.date)}
					style={{ width: 150, marginRight: 15 }}
				/>

				<Button onClick={save} size="middle" type="primary">
					Зберегти
				</Button>
			</Row>

			<Row>
				<Col span={8}>
					<MenuTabAtom
						title="Сніданок"
						pressAdd={() => addItem('mornin')}
						items={items.mornin}
						onPressItem={selectItemId}
						selectedItemId={selectedItemId}
						onPressRemoveItem={removeItem}
					/>
					<MenuTabAtom
						title="Обід"
						pressAdd={() => addItem('dinner')}
						items={items.dinner}
						onPressItem={selectItemId}
						selectedItemId={selectedItemId}
						onPressRemoveItem={removeItem}
					/>
					<MenuTabAtom
						title="Вечеря"
						pressAdd={() => addItem('supper')}
						items={items.supper}
						onPressItem={selectItemId}
						selectedItemId={selectedItemId}
						onPressRemoveItem={removeItem}
					/>
				</Col>
				<Col span={1}></Col>
				<Col span={15}>
					<ItemEditor
						item={selectedItem}
						onPressAddProduct={() => addProduct()}
						items={form.values.items}
						setItems={items => form.setField('items', items)}
					/>
				</Col>
			</Row>
		</div>
	)
}

const styles = createStyleSheet({
	title: {
		marginBottom: 0,
		marginRight: 30,
	},
	back: {
		fontSize: 24,
		marginRight: 20,
		cursor: 'pointer',
	},
})
