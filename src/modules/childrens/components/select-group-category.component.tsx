import { GroupCategoryKey } from '@/@types/enums'
import { Select } from 'antd'
import React, { useEffect } from 'react'

interface Props {
	val: string
	onChange: (val: GroupCategoryKey) => void
	style?: React.CSSProperties
}
export const SelectGroupCategory = ({ val, onChange, style }: Props) => {
	useEffect(() => {
		if (val === undefined) onChange(GroupCategoryKey.Junior)
	}, [val])

	return (
		<Select
			style={style}
			placeholder="1-4 р."
			size="middle"
			value={val}
			onChange={val => onChange(val as GroupCategoryKey)}>
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
	)
}
