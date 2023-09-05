import { Button, Drawer, Input } from 'antd'
import React, { ChangeEventHandler, FC, useState } from 'react'
import { settingsAPI } from '../../api'

export const ImportDatabaseModalWidget = () => {
	const [isOpen, setOpen] = useState(false)
	const [file, setFile] = useState<any>()

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFile(e.target.files[0])
	}

	const submit = () => {
		console.log(file)
		settingsAPI.importDatabase(file.path)
	}

	return (
		<>
			<Button type="primary" size="large" onClick={() => setOpen(true)}>
				Імпорт бази данних
			</Button>

			<Drawer
				title="Імпорт бази данних"
				placement="right"
				onClose={() => setOpen(false)}
				visible={isOpen}>
				<Input type="file" onChange={onChange} />

				<Button type="primary" size="large" onClick={submit}>
					Зберегти
				</Button>
			</Drawer>
		</>
	)
}
