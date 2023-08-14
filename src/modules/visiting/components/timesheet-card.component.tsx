import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { noop } from 'lodash'
import React from 'react'

export const TimesheetCardComponent = () => {
	return (
		<Card
			size="small"
			actions={[
				<DeleteOutlined onClick={() => noop()} />,
				<EditOutlined key="edit" title="Редагувати" onClick={noop} />,
			]}>
			<Meta title={'Діти 04.08.2022'} />
		</Card>
	)
}
