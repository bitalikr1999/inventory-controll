import { HistoryRecordType } from '@/@types/enums'
import { IWarehouseHistoryRecord } from '@/@types/interfaces'
import { IHistoryRecord } from '@/modules/history/typing'
import moment from 'moment'

export function prepareItems(items: IWarehouseHistoryRecord[]) {
	return items.map(prepareItem)
}

function prepareItem(item: IWarehouseHistoryRecord): IHistoryRecord {
	return {
		id: item._id,
		title: item.product.name,
		description: prepareDescription(item),
		type: item.type,
		createdAt: moment(new Date(item.createdAt)).format('DD MMMM YYYY'),
	}
}

function prepareDescription(item: IWarehouseHistoryRecord) {
	let result = []

	if (item.type === HistoryRecordType.Income) {
		result.push('Нарахування')
	} else {
		result.push('Списання')
	}

	result.push(`Ціна: ${item.price} грн.`)

	result.push(`Кількість: ${item.productCount}`)

	if (item.comment) result.push(`Коментар: ${item.comment}`)

	return result.join('</br>')
}
