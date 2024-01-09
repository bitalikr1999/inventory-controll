import { IProduct } from '@/@types/interfaces'
import { ProductAutocomplite } from '@/modules/products/smart-components'
import { $eventVal, createStyleSheet } from '@/shared/helpers'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import _ from 'lodash'
import React, { FC } from 'react'
import { IWarehouseAdmissionItem } from '../intefaces'
import { FormControllerNumber } from '@/shared/components/form'

interface Props {
	items: IWarehouseAdmissionItem[]
	onChange: (items: IWarehouseAdmissionItem[]) => void
}

export const AdmissionEditorAtom: FC<Props> = ({ items, onChange }) => {
	const addRow = () => {
		const _items = [
			...items,
			{
				price: 0,
				count: 0,
			},
		]

		onChange(_.cloneDeep(_items))
	}

	const onChangeRow = (index: number, field: any, value: any) => {
		const _items: any = [...items]
		_items[index][field] = value
		onChange(_.cloneDeep(_items))
	}

	const onChangeProduct = (index: number, product: IProduct) => {
		const _items: any = [...items]
		_items[index] = {
			count: 1,
			summ: product.price,
			product,
		}
		onChange(_.cloneDeep(_items))
	}

	const columns: ColumnsType<IWarehouseAdmissionItem> = [
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
			render: (_, record: any, i) => {
				return (
					<ProductAutocomplite
						product={record?.product}
						onChange={product => onChangeProduct(i, product)}
					/>
				)
			},
		},
		{
			title: 'К-сть',
			dataIndex: 'count',
			key: 'count',
			render: (val, record, i) => {
				return (
					<FormControllerNumber
						placeholder=""
						value={val}
						type="number"
						disabled={!record.product}
						addonBefore={record.product?.measurmentUnit}
						onChangeTxt={txt => onChangeRow(i, 'count', txt)}
					/>
				)
			},
		},
		{
			title: 'Сума',
			key: 'summ',
			render: (_, record, i) => {
				return (
					<FormControllerNumber
						placeholder=""
						value={record.summ}
						type="number"
						disabled={!record.product}
						addonAfter={'грн.'}
						onChangeTxt={txt => onChangeRow(i, 'summ', txt)}
					/>
				)
			},
		},
		{
			title: 'Ціна за одиницю',
			key: 'price',
			render: (_, record, i) => {
				if (!record.summ || !record.count) return null
				return (
					<Input
						placeholder=""
						value={Number(record.summ) / Number(record.count)}
						type="number"
						disabled={true}
					/>
				)
			},
		},
	]

	return (
		<div style={styles.container}>
			<Table
				dataSource={items}
				columns={columns}
				pagination={false}
				style={{ marginBottom: 20 }}
			/>
			<Button
				type="primary"
				icon={<SearchOutlined />}
				onClick={() => addRow()}>
				Додати
			</Button>
		</div>
	)
}

const styles = createStyleSheet({
	container: {
		padding: 10,
	},
})
