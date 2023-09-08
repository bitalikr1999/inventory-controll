import { IProduct } from '@/@types/interfaces'
import { $eventVal } from '@/shared/helpers/form.helper'
import { AutoComplete, Input, InputRef } from 'antd'
import _ from 'lodash'
import { FC, useEffect, useRef, useState } from 'react'
import { useProducts } from '../hooks'

interface Props {
	onChange: (product: IProduct) => void
	product?: IProduct
}

export const ProductAutocomplite: FC<Props> = ({ onChange, product }) => {
	const [value, setValue] = useState('')
	const [options, setOptions] = useState<{ value: string }[]>([])
	const [hideOptions, setHideOptions] = useState(false)
	const inputRef = useRef<InputRef>(null)

	const { items } = useProducts(true)

	useEffect(() => {
		if (product) {
			setValue(product.name)
		}
	}, [product])

	const onSearch = (searchText: string) => {
		const results = _.filter(items, function (item) {
			return (
				item.name
					.toLocaleLowerCase()
					.indexOf(searchText.toLocaleLowerCase()) > -1
			)
		})
		setOptions(
			results.map(it => ({
				value: it.name,
			})),
		)
	}
	const onSelect = (data: string) => {
		console.log(items)
		const item = items.find(it => it.name === data)
		setHideOptions(true)
		onChange(item)
	}

	useEffect(() => {
		setHideOptions(false)
		onSearch(value)
	}, [value])

	const onFocus = () => {
		onSearch(value)
	}

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
					onFocus={e => onFocus()}
				/>
			</AutoComplete>
		</>
	)
}
