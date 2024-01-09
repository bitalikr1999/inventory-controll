import { $eventVal } from '@/shared/helpers'
import { Input, InputProps, InputRef } from 'antd'
import _ from 'lodash'
import React, { FC, useRef } from 'react'

interface Props extends InputProps {
	onChangeTxt: (text: string) => void
}

export const FormControllerNumber: FC<Props> = props => {
	const onKeypress = (e: any) => {
		const keyCode = e.code || e.key
		if (keyCode === 'BracketRight') {
			e.preventDefault()
			const value = Number(props.value)
			if (_.isInteger(value)) props.onChangeTxt(String(value + 0.1))
		}
	}

	return (
		<Input
			{...props}
			onKeyPress={onKeypress}
			type="number"
			onChange={e => props.onChangeTxt($eventVal(e))}
		/>
	)
}
