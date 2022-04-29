import { GroupCategoryKey, RouteKey } from '@/@types/enums'
import { IProduct } from '@/@types/interfaces'
import { PageBackBtn } from '@/shared/components/grid'
import { createStyleSheet } from '@/shared/helpers'
import { useForm } from '@/shared/hooks/useForm'
import { AppstoreAddOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Col, Row, Select, Table } from 'antd'
import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { Route, useLocation, useNavigate } from 'react-router-dom'
import { ItemEditor } from '../../atoms/item-editor.atom'
import { MenuTabAtom } from '../../atoms/menu-tab.atom'
import { useMenus } from '../../hooks'
import {
	MenuEditorForm,
	MenuEditorItem,
	MenuItemPeriod,
} from '../../interfaces'
const randomstring = require('randomstring')

export const MenuEditorPage = () => {
	const form = useForm<MenuEditorForm>(
		{
			items: [],
		},
		() => null,
	)
	const [selectedItemId, selectItemId] = useState<string>()
	const { set, getOne } = useMenus()
	const navigate = useNavigate()
	const location: any = useLocation()
	const existId = location.state?.id

	const loadExist = async () => {
		const menu = await getOne(existId)
		console.log('exist menu', menu)
		form.set(menu)
	}

	useEffect(() => {
		if (existId) loadExist()
	}, [existId])

	const addItem = (period: MenuItemPeriod) => {
		const items = [...form.values.items]
		const id = randomstring.generate(12)
		items.push({
			id,
			name: '',
			period,
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
				date: new Date(),
				items: values.items,
				groupCategory: values.groupCategory,
			})
		} finally {
			navigate(RouteKey.Menu)
		}
	}

	return (
		<div>
			<PageBackBtn />
			<Row style={{ alignItems: 'center', marginBottom: 20 }}>
				<h1 style={styles.title}>Створення меню</h1>

				<Select
					style={{ width: 150, marginRight: 30 }}
					placeholder="1-4 р."
					size="middle"
					value={form.values.groupCategory}
					onChange={val => form.setField('groupCategory', val)}>
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
					/>
					<MenuTabAtom
						title="Обід"
						pressAdd={() => addItem('dinner')}
						items={items.dinner}
						onPressItem={selectItemId}
						selectedItemId={selectedItemId}
					/>
					<MenuTabAtom
						title="Вечеря"
						pressAdd={() => addItem('supper')}
						items={items.supper}
						onPressItem={selectItemId}
						selectedItemId={selectedItemId}
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
