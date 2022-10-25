import { IProduct } from '@/@types/interfaces'
import { Col, Row, Table } from 'antd'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { AdmissionEditorAtom } from '../../atoms'
import { IWarehouseAdmissionItem } from '../../intefaces'

export const WarehouseAdmissionPage = () => {
	const [items, setItems] = useState<IWarehouseAdmissionItem[]>([])

	useEffect(() => {
		if (_.isEmpty(items)) setItems([{ count: 0, summ: 0 }])
	}, [items])

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
		</div>
	)
}
