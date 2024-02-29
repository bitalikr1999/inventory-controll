import { IProduct } from '@/@types/interfaces'
import { createStyleSheet } from '@/shared/helpers'
import { getSumm } from '@/shared/helpers/number.helper'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Row, Table } from 'antd'
import _ from 'lodash'
import { FC } from 'react'
import { MenuEditorForm, MenuEditorItem } from '../interfaces'
import './style.css'

interface MenuTabProps {
	title: string
	pressAdd: () => void
	items: MenuEditorForm['items']
	onPressItem: (itemId: string) => void
	selectedItemId: string
	onPressRemoveItem: (itemId: string) => void
}

export const MenuTabAtom: FC<MenuTabProps> = ({
	title,
	pressAdd,
	items,
	onPressItem,
	selectedItemId,
	onPressRemoveItem,
}) => {
	const getPrice = (item: MenuEditorItem) => {
		let result = 0

		item.products?.map(it => {
			if (!it.product) return
			result =
				Number(result) + getSumm(it.product?.price, Number(it.count))
		})

		return Number(String(result)).toLocaleString('ru-RU', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 3,
		})
	}
	const renderItems = () => {
		return items.map(it => {
			const isActive = it.id === selectedItemId
			return (
				<div
					className="editor-menu-tab"
					style={{
						...styles.item,
						...(isActive ? styles.itemActive : {}),
					}}
					onClick={() => onPressItem(it.id)}>
					<p style={{ ...styles.itemText, width: '50%' }}>
						{it.name ? it.name : 'Без назви'}
					</p>
					<p style={{ ...styles.itemText, width: '30%' }}>
						{getPrice(it)} грн.{' '}
					</p>
					<Row>
						<Button
							shape="circle"
							type="primary"
							size="small"
							onClick={() => onPressRemoveItem(it.id)}
							style={{
								background: '#ff522b',
								borderColor: '#ff522b',
							}}
							icon={<DeleteOutlined />}
						/>
					</Row>
				</div>
			)
		})
	}
	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<p style={styles.title}>{title}</p>
				<Button onClick={pressAdd} size="middle" type="primary">
					Додати страву
				</Button>
			</div>
			{!_.isEmpty(items) ? (
				<div style={styles.list}>{renderItems()}</div>
			) : null}
		</div>
	)
}

const styles = createStyleSheet({
	container: {
		width: '100%',
		padding: 10,
		border: '1px solid rgba(0,0,0,.1)',
		borderRadius: 3,
		marginBottom: 15,
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	title: {
		fontSize: 18,
		marginBottom: 0,
	},
	button: {},
	item: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 5,
		cursor: 'pointer',
		border: '1px solid rgba(0,0,0,.1)',
		marginBottom: 10,
		borderRadius: 3,
	},
	itemActive: {
		background: 'rgba(25,255,0,.1)',
	},
	list: {},
	itemText: {
		marginBottom: 0,
		width: '30%',
	},
})
