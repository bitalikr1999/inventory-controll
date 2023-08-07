import React, { FC } from 'react'
import { IProduct } from '@/@types/interfaces'
import { $eventVal, createStyleSheet } from '@/shared/helpers'
import { useForm } from '@/shared/hooks/useForm'
import { Button, Drawer, Input } from 'antd'

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

	const submit = async () => {
		try {
			await window.Main.emit('warehouseAdmission', {
				items: [
					{
						...form.values,
						product,
						price:
							Number(form.values.summ) /
							Number(form.values.count),
					},
				],
			})
			onPressClose()
		} catch (e) {}
	}

	return (
		<Drawer
			title="Поступлення"
			placement="right"
			onClose={onPressClose}
			visible={Boolean(product)}>
			<div className="form-block">
				<p className="form-label">Продукт</p>
				<Input
					size="large"
					placeholder="Продукт"
					value={product?.name}
				/>
			</div>

			<div className="form-block">
				<p className="form-label">Кількість</p>
				<Input
					placeholder=""
					value={form.values.count}
					type="number"
					addonBefore={form.values.product?.measurmentUnit}
					onChange={e => form.setField('count', $eventVal(e))}
				/>
			</div>

			<div className="form-block">
				<p className="form-label">Сума</p>
				<Input
					placeholder=""
					value={form.values.summ}
					type="number"
					addonAfter={'грн.'}
					onChange={e => form.setField('summ', $eventVal(e))}
				/>
			</div>

			<Button
				type="primary"
				size="large"
				style={styles.button}
				onClick={() => form.onSubmit(submit)}>
				Створити
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
