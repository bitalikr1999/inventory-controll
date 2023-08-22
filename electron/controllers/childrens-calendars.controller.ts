import { IChildrenCalendarRecord } from '@/@types/interfaces'
import { Controller } from 'electron/abstract'
import { ChildrenCounter } from 'electron/core/childrens/children-counter'
import { ReportCardXlsx } from 'electron/core/childrens/report-card-xlsx'
import { MenuChildCountSyncer } from 'electron/core/menu/menu-child-count-syncer'
import { childrensCalendarsRepository } from 'electron/repositories'
import {
	GetOneChildrensCalendarParams,
	IGenerateXlsxReportCardParams,
	IGetPresentChildrenParams,
} from 'electron/typing'

export class ChildrensCalendarsController extends Controller {
	protected basePath = 'childrensCalendars'
	protected routes = {
		getOne: this.handleGetOne,
		put: this.handlePut,
		getPresentChildrenCount: this.handleGetPresentChildrenCount,
		generateReportCardXlsx: this.handleGenerateReportCardXlsx,
	}

	protected async handleGetOne(
		_: unknown,
		params: GetOneChildrensCalendarParams,
	) {
		const isExist = await childrensCalendarsRepository.findOne({
			groupId: params.groupId,
			date: params.date,
		})
		return isExist
	}

	protected async handlePut(_: unknown, params: IChildrenCalendarRecord) {
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

		await MenuChildCountSyncer.syncByYMDateString(params.date)
	}

	protected async handleGetPresentChildrenCount(
		_: unknown,
		params: IGetPresentChildrenParams,
	) {
		const childrenCounter = new ChildrenCounter().setParams(params)
		return await childrenCounter.calc()
	}

	protected async handleGenerateReportCardXlsx(
		_: unknown,
		params: IGenerateXlsxReportCardParams,
	) {
		new ReportCardXlsx().generate(params)
	}
}
