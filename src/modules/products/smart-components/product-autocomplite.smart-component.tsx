import { IProduct } from '@/@types/interfaces'
import { $eventVal } from '@/shared/helpers/form.helper'
import { AutoComplete, Input } from 'antd'
import _ from 'lodash'
import { FC, useEffect, useState } from 'react'
import { useProducts } from '../hooks'

interface Props {
	onChange: (product: IProduct) => void
}

export const ProductAutocomplite: FC<Props> = ({ onChange }) => {
	const [value, setValue] = useState('')
	const [options, setOptions] = useState<{ value: string }[]>([])
	const [hideOptions, setHideOptions] = useState(false)

	const { items } = useProducts()

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
		console.log('onSelect', data)
		const item = items.find(it => it.name === data)
		console.log('items', item)
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
				onSelect={onSelect}>
				<Input.Search
					size="middle"
					placeholder="Назва продукту"
					value={value}
					onChange={e => setValue($eventVal(e))}
				/>
			</AutoComplete>
		</>
	)
}
