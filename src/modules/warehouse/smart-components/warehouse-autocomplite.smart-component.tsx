import { IProduct, IWarehouseItem } from '@/@types/interfaces'
import { $eventVal } from '@/shared/helpers/form.helper'
import { AutoComplete, Input, InputRef } from 'antd'
import _ from 'lodash'
import { FC, useEffect, useRef, useState } from 'react'
import { useWarehouseList } from '../hooks'

interface Props {
	onChange: (product: IWarehouseItem) => void
	item?: IWarehouseItem
}

export const WarehouseAutocomplite: FC<Props> = ({ onChange, item }) => {
	const [value, setValue] = useState('')
	const [options, setOptions] = useState<{ value: string }[]>([])
	const [hideOptions, setHideOptions] = useState(false)
	const inputRef = useRef<InputRef>(null)

	const { items } = useWarehouseList()

	useEffect(() => {
		if (item && item.product) {
			setValue(item.product.name)
		}
	}, [item])

	const onSearch = (searchText: string) => {
		const results = _.filter(items, function (item) {
			return (
				item.product.name
					.toLocaleLowerCase()
					.indexOf(searchText.toLocaleLowerCase()) > -1
			)
		})
		setOptions(
			results.map(it => ({
				value: `${it.product.name} ${it.price}₴`,
			})),
		)
	}
	const onSelect = (data: string) => {
		const item = items.find(
			it => `${it.product.name} ${it.price}₴` === data,
		)
		setHideOptions(true)
		onChange(item)
	}

	useEffect(() => {
		setHideOptions(false)
		onSearch(value)
	}, [value])

	return (
		<>
			<AutoComplete
				options={hideOptions ? [] : options}
				style={{ width: '100%' }}
				value={value}
				onSelect={onSelect}>
				<Input.Search
					ref={inputRef}
					size="middle"
					placeholder="Назва продукту"
					value={value}
					defaultValue={value}
					onChange={e => setValue($eventVal(e))}
				/>
			</AutoComplete>
		</>
	)
}
