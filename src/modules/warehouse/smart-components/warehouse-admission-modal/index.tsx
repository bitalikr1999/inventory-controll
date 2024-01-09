import React, { FC, useState } from 'react'
import { IProduct } from '@/@types/interfaces'
import { $eventVal, createStyleSheet } from '@/shared/helpers'
import { useForm } from '@/shared/hooks/useForm'
import { Button, Drawer, Input, Switch } from 'antd'
import { warehouseAPI } from '../../api'

interface Props {
	product: IProduct
	onPressClose?: () => void
}

interface Form {
	product: IProduct
	summ?: number
	count: number
}

export const WarehouseAdmissionModalSmart: FC<Props> = ({
	product,
	onPressClose,
}) => {
	const form = useForm<Form>({}, () => null)
	const [mod, setMod] = useState<'add' | 'substruct'>('add')

	const submit = async () => {
		try {
			await warehouseAPI.admission({
				items: prepareToSave(),
			})
			onPressClose()
		} catch (e) {}
	}

	const prepareToSave = () => {
		return [
			{
				...form.values,
				product,
				price: Number(form.values.summ) / Number(form.values.count),
			},
		]
	}

	const renderInputs = () => {
		const inputs = [
			<div className="form-block">
				<p className="form-label">Продукт</p>
				<Input
					size="large"
					placeholder="Продукт"
					value={product?.name}
					disabled
				/>
			</div>,
			<div className="form-block">
				<p className="form-label">Кількість</p>
				<Input
					placeholder=""
					value={form.values.count}
					type="number"
					addonBefore={form.values.product?.measurmentUnit}
					onChange={e => form.setField('count', $eventVal(e))}
				/>
			</div>,
		]
		if (mod === 'add') {
			inputs.push(
				<div className="form-block">
					<p className="form-label">Сума</p>
					<Input
						placeholder=""
						value={form.values.summ}
						type="number"
						addonAfter={'грн.'}
						onChange={e => form.setField('summ', $eventVal(e))}
					/>
				</div>,
			)
		}
		console.log(inputs)

		return inputs
	}

	return (
		<Drawer
			title="Поступлення"
			placement="right"
			onClose={onPressClose}
			visible={Boolean(product)}>
			<div className="form-block">
				<p className="form-label">
					{mod === 'add' ? 'Нарахування' : 'Списання'}
				</p>
				<Switch
					defaultChecked
					checked={mod === 'add'}
					onChange={e => setMod(e ? 'add' : 'substruct')}
				/>
			</div>

			{renderInputs()}

			<Button
				type="primary"
				size="large"
				style={styles.button}
				onClick={() => form.onSubmit(submit)}>
				{mod === 'add' ? 'Нарахувати' : 'Списати'}
			</Button>
		</Drawer>
	)
}

const styles = createStyleSheet({
	button: {
		width: '100%',
		marginTop: 10,
	},
})
