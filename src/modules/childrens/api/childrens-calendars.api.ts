import { IChildrenCalendarRecord } from '@/@types/interfaces'
import { API } from '@/shared/core'
import {
	GetOneChildrensCalendarParams,
	IGenerateXlsxReportCardParams,
	IGetPresentChildrenParams,
} from 'electron/typing'

class ChildrensCalendarsAPI extends API {
	protected basePath = 'childrensCalendars'

	public getOne(params: GetOneChildrensCalendarParams) {
		return this.calls('getOne', params)
	}

	public put(payload: IChildrenCalendarRecord) {
		return this.call('put', payload)
	}

	public getPresentChildrenCount(params: IGetPresentChildrenParams) {
		return this.call('getPresentChildrenCount', params)
	}

	public generateReportCardXlsx(params: IGenerateXlsxReportCardParams) {
		return this.call('generateReportCardXlsx', params)
	}
}

export const childrensCalendarsAPI = new ChildrensCalendarsAPI()
