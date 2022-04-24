import { $eventVal } from '@/shared/helpers/form.helper'
import { Input, InputProps } from 'antd'
import { FC } from 'react'

interface FormControllProps extends InputProps {
	label?: string
	error?: string
	onChangeVal?: (val: string) => void
}

export const FormControll: FC<FormControllProps> = ({
	label,
	error,
	onChangeVal,
	...props
}) => {
	return (
		<div className="form-block">
			<p className="form-label">{label}</p>
			<Input {...props} onChange={e => onChangeVal($eventVal(e))} />
		</div>
	)
}
