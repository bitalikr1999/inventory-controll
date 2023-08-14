import { IChildrenCalendarRecord } from '@/@types/interfaces'
import { ipcMain } from 'electron'
import { ChildrenCounter } from 'electron/core/childrens/children-counter'
import { ReportCardXlsx } from 'electron/core/childrens/report-card-xlsx'
import { childrensCalendarsRepository } from 'electron/store/childrens-calendar'
import {
	ICountChildrenCountParams,
	IGenerateXlsxReportCardParams,
} from 'electron/typing'

interface GetCalendar {
	groupId: string
	date: string
}

export const initChildrensCalendarsListener = () => {
	ipcMain.handle(
		'getChildrenGroupCalendar',
		async (_, params: GetCalendar) => {
			const isExist = await childrensCalendarsRepository.findOne({
				groupId: params.groupId,
				date: params.date,
			})
			return isExist
		},
	)

	ipcMain.handle(
		'putChildrenGroupCalendar',
		async (_, params: IChildrenCalendarRecord) => {
			const isExist = await childrensCalendarsRepository.findOne({
				groupId: params.groupId,
				date: params.date,
			})

			if (!isExist) {
				await childrensCalendarsRepository.insert(params)
			} else {
				await childrensCalendarsRepository.updateOne(
					{
						_id: isExist._id,
					},
					params,
				)
			}
		},
	)

	ipcMain.handle(
		'childrenCountByDay',
		async (_, params: ICountChildrenCountParams) => {
			const childrenCounter = new ChildrenCounter().setParams(params)

			return await childrenCounter.calc()
		},
	)

	ipcMain.handle(
		'generateReportCard',
		async (_, params: IGenerateXlsxReportCardParams) => {
			new ReportCardXlsx().generate(params)
		},
	)
}
