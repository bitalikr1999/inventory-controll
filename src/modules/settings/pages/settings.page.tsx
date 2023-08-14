import React, { useEffect, useMemo, useState } from 'react'
import { IProduct, ISetting } from '@/@types/interfaces'
import { $eventVal } from '@/shared/helpers'
import { useStoreDate } from '@/shared/hooks'
import { Button, Col, Divider, Input, Row } from 'antd'
import _ from 'lodash'

export const SettingsPage = () => {
	const { data, set } = useStoreDate<ISetting[]>({
		store: 'settings',
		field: 'list',
		serrialization: (items: ISetting[]) => {
			return items ? items : []
		},
	})

	const [items, setItems] = useState<ISetting[]>([])

	useEffect(() => {
		if (Array.isArray(data)) setItems(data)
	}, [data])

	const values = useMemo(() => {
		return items.reduce((res, item) => {
			res[item.key] = item.value
			return res
		}, {} as any)
	}, [items])

	const onChange = (key: string, value: string) => {
		let keyExist = false
		const _items = _.cloneDeep(items).map(it => {
			if (it.key === key) {
				keyExist = true
				return {
					...it,
					value,
				}
			}
			return it
		})
		if (!keyExist) _items.push({ key, value, label: key })
		setItems(_items)
	}

	const submit = () => {
		set(items)
	}

	const openDbFolder = () => {
		window.Main.emit('openDbFolder', null)
	}
	return (
		<div>
			<h1>Налаштування</h1>

			<Row>
				<Col span={11}>
					<div className="form-block">
						<p className="form-label">Назва закладу</p>
						<Input
							size="large"
							placeholder=""
							value={values.name}
							onChange={e => onChange('name', $eventVal(e))}
						/>
					</div>

					<div className="form-block">
						<p className="form-label">ФІО Директор</p>
						<Input
							size="large"
							placeholder=""
							value={values.director}
							onChange={e => onChange('director', $eventVal(e))}
						/>
					</div>

					<div className="form-block">
						<p className="form-label">ФІО Лікаря</p>
						<Input
							size="large"
							placeholder=""
							value={values.doctor}
							onChange={e => onChange('doctor', $eventVal(e))}
						/>
					</div>

					<div className="form-block">
						<p className="form-label">ФІО "Приняв"</p>
						<Input
							size="large"
							placeholder=""
							value={values.peopleWhoAccepted}
							onChange={e =>
								onChange('peopleWhoAccepted', $eventVal(e))
							}
						/>
					</div>

					<div className="form-block">
						<p className="form-label">ФІО "Видав"</p>
						<Input
							size="large"
							placeholder=""
							value={values.peopleWhoIssuedBy}
							onChange={e =>
								onChange('peopleWhoIssuedBy', $eventVal(e))
							}
						/>
					</div>
				</Col>
				<Col span={1}></Col>

				<Col span={11}>
					<div className="form-block">
						<p className="form-label">код ЄДРПОУ</p>
						<Input
							size="large"
							placeholder=""
							value={values.edrpoy}
							onChange={e => onChange('edrpoy', $eventVal(e))}
						/>
					</div>
				</Col>
			</Row>

			<Button type="primary" size="large" onClick={submit}>
				Зберегти
			</Button>

			<Divider />

			<h1>Швидкі дії</h1>

			<Button type="primary" size="large" onClick={openDbFolder}>
				Відкрити db теку
			</Button>
		</div>
	)
}