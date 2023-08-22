import { RouteKey } from '@/@types/enums'
import { IProduct } from '@/@types/interfaces'
import { appEvents } from '@/shared/events'
import { Button, Col, Row, Table } from 'antd'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdmissionEditorAtom } from '../../atoms'
import { IWarehouseAdmissionItem } from '../../intefaces'
import { warehouseAPI } from '../../api'

export const WarehouseAdmissionPage = () => {
	const [items, setItems] = useState<IWarehouseAdmissionItem[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		if (_.isEmpty(items)) setItems([{ count: 0, summ: 0 }])
	}, [items])

	const submit = async () => {
		await warehouseAPI.admission({
			items: items
				.filter(it => Boolean(it.product))
				.map(it => {
					return {
						...it,
						price: Number(it.summ) / Number(it.count),
					}
				}),
		})
		await navigate(RouteKey.Warehouse)
	}

	return (
		<div>
			<Row align="middle">
				<Col span={16}>
					<h1>Поступлення товарів на склад</h1>
				</Col>
			</Row>

			<AdmissionEditorAtom
				items={items}
				onChange={_items => setItems(_items)}
			/>

			<Button onClick={submit}>Зберегти</Button>
		</div>
	)
}
