import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IProduct, ISetting } from '@/@types/interfaces'
import { $eventVal } from '@/shared/helpers'
import { useStoreDate } from '@/shared/hooks'
import { Button, Col, Divider, Input, Row } from 'antd'
import _ from 'lodash'
import { settingsAPI } from '../api'
import { ImportDatabaseModalWidget } from '../widgets/import-database'
import { useSettings } from '../hooks'

export const SettingsPage = () => {
	const { items: settings, isLoading } = useSettings()
	const [items, setItems] = useState<Record<string, string>>({})

	const settingsToObject = useCallback((settings: ISetting[]) => {
		return _.mapValues(_.keyBy(settings, 'key'), 'value')
	}, [])

	const objectToSettings = useCallback(
		(obj: Record<string, string>): ISetting[] => {
			return Object.entries(obj).map(([key, value]) => ({ key, value }))
		},
		[],
	)

	const submit = async () => {
		await settingsAPI.put({ items: objectToSettings(items) })
	}

	useEffect(() => {
		if (Array.isArray(settings)) setItems(settingsToObject(settings))
	}, [settings])

	const onChange = (key: string, value: string) => {
		const toSave = _.clone(items)
		toSave[key] = value
		setItems(toSave)
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
							value={items.name}
							onChange={e => onChange('name', $eventVal(e))}
						/>
					</div>

					<div className="form-block">
						<p className="form-label">ФІО Директор</p>
						<Input
							size="large"
							placeholder=""
							value={items.director}
							onChange={e => onChange('director', $eventVal(e))}
						/>
					</div>

					<div className="form-block">
						<p className="form-label">ФІО Лікаря</p>
						<Input
							size="large"
							placeholder=""
							value={items.doctor}
							onChange={e => onChange('doctor', $eventVal(e))}
						/>
					</div>

					<div className="form-block">
						<p className="form-label">ФІО Комірника</p>
						<Input
							size="large"
							placeholder=""
							value={items.storekeeper}
							onChange={e =>
								onChange('storekeeper', $eventVal(e))
							}
						/>
					</div>

					<div className="form-block">
						<p className="form-label">ФІО "Видав"</p>
						<Input
							size="large"
							placeholder=""
							value={items.peopleWhoIssuedBy}
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
							value={items.edrpoy}
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

			<div style={{ marginBottom: 20 }}>
				<Button
					type="primary"
					size="large"
					onClick={() => settingsAPI.openDbFolder()}>
					Відкрити db теку
				</Button>
			</div>
			<div style={{ marginBottom: 20 }}>
				<ImportDatabaseModalWidget />
			</div>

			<div style={{ marginBottom: 20 }}>
				<Button
					type="primary"
					size="large"
					onClick={() => settingsAPI.exportDatabase()}>
					Експорт бази данних
				</Button>
			</div>
		</div>
	)
}
