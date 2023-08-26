import { HistoryRecordType } from '@/@types/enums'

export interface IHistoryRecord {
	id?: string
	title: string
	description: string

	type: HistoryRecordType

	createdAt: string
}
