import { IProduct } from '@/@types/interfaces'
import { ProductAutocomplite } from '@/modules/products/smart-components'
import { createStyleSheet } from '@/shared/helpers'
import { $eventVal } from '@/shared/helpers/form.helper'
import { getSumm } from '@/shared/helpers/number.helper'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import _ from 'lodash'
import { FC, useEffect } from 'react'
import { MenuEditorItem, MenuEditorProduct } from '../interfaces'
const randomstring = require('randomstring')

interface ItemEditorProps {
	item: MenuEditorItem
	onPressAddProduct: () => void
	setItems: (items: MenuEditorItem[]) => void
	items: MenuEditorItem[]
}

export const ItemEditor: FC<ItemEditorProps> = ({
	item,
	onPressAddProduct,
	items,
	setItems,
}) => {
	if (!item) return null

	const setProductField = <
		T extends MenuEditorProduct,
		K extends keyof MenuEditorProduct,
	>(
		productId: string,
		value: T[K],
		field: K,
	) => {
		const _items = [...items]

		const index = items.findIndex(it => it.id === item.id)
		const productIndex = _items[index].products.findIndex(
			it => it.id === productId,
		)

		_items[index].products[productIndex][field] = value

		setItems(_.cloneDeep(_items))
	}

	const addRow = () => {
		const _items = [...items]
		const index = items.findIndex(it => it.id === item.id)

		if (!items[index].products) _items[index].products = []
		_items[index].products.push({
			id: randomstring.generate(12),
			product: null,
			count: 0,
		})
		setItems(_.cloneDeep(_items))
	}

	const setName = (name: string) => {
		const _items = [...items]
		const index = items.findIndex(it => it.id === item.id)
		_items[index].name = name
		setItems(_.cloneDeep(_items))
	}

	const setWeight = (weight: string) => {
		const _items = [...items]
		const index = items.findIndex(it => it.id === item.id)
		_items[index].weight = weight
		setItems(_.cloneDeep(_items))
	}

	const columns: ColumnsType = [
		{
			title: '#',
			dataIndex: 'id',
			key: 'id',
			render: (_, record, index) => {
				return index
			},
		},
		{
			title: 'Продукт',
			dataIndex: 'name',
			key: 'name',
			render: (_, record: any) => {
				return (
					<ProductAutocomplite
						product={record?.product}
						onChange={product =>
							setProductField(record.id, product, 'product')
						}
					/>
				)
			},
		},
		{
			title: 'К-сть',
			dataIndex: 'count',
			key: 'count',
			render: (val, record: any) => {
				return (
					<Input
						placeholder=""
						value={val}
						type="number"
						addonBefore={record.product?.measurmentUnit}
						onChange={e =>
							setProductField(record.id, $eventVal(e), 'count')
						}
					/>
				)
			},
		},
		{
			title: 'Ціна',
			dataIndex: 'product',
			key: 'price',
			render: val => {
				if (!val) return 0
				return `${Number(val.price)} грн.`
			},
		},
		{
			title: 'Сума',
			dataIndex: 'product',
			key: 'address',
			render: (val, record: any) => {
				if (!val) return 0

				return `${getSumm(val.price, record.count)} грн.`
			},
		},
	]

	// console.log(item.products)

	useEffect(() => {
		console.log(item.products)
	}, [item.products])
	return (
		<div style={styles.container}>
			<Input
				placeholder="Назва"
				value={item.name}
				onChange={e => setName($eventVal(e))}
				style={{ marginBottom: 20 }}
			/>
			<Input
				placeholder="Вихід"
				value={item.weight}
				onChange={e => setWeight($eventVal(e))}
				style={{ marginBottom: 20 }}
			/>
			<Table
				dataSource={item.products}
				columns={columns}
				pagination={false}
				style={{ marginBottom: 20 }}
			/>
			<Button
				type="primary"
				icon={<SearchOutlined />}
				onClick={() => addRow()}>
				Додати інгредієнт
			</Button>
		</div>
	)
}

const styles = createStyleSheet({
	container: {
		padding: 10,
		border: '1px solid rgba(0,0,0,.1)',
	},
})
