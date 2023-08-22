import {
	IChildrenCalendarChild,
	IChildrenCalendarRecord,
	IGroup,
} from '@/@types/interfaces'
import { IGenerateXlsxReportCardParams } from 'electron/typing'

import { MenuReport } from '../menu/menu-report'
import moment from 'moment'
import {
	ReportCardXlsxGenerator,
	XlsxReportCardData,
	XlsxReportCardGroup,
	XlsxReportCardItem,
} from 'electron/xlsx/report-card'
import { getFromStore } from 'electron/store'
import { YMstringToDate } from 'electron/helpers/date'
import {
	childrensCalendarsRepository,
	childrensGroupsRepository,
	childrensRepository,
} from 'electron/repositories'

export class ReportCardXlsx {
	private repository = childrensCalendarsRepository
	private groupsRepository = childrensGroupsRepository
	private childrenRepository = childrensRepository

	private params: IGenerateXlsxReportCardParams
	private daysInMonthCount = 0
	private menuReport: MenuReport

	private result: XlsxReportCardData = {
		date: new Date(),
		groups: [],
		setting: {
			name: '',
			edrpoy: '',
			daysInMonthCount: 0,
			director: '',
		},
	}

	public async generate(params: IGenerateXlsxReportCardParams) {
		this.params = params
		this.menuReport = new MenuReport()
		this.result.date = this.getDateobject()
		this.initDaysCount()

		await this.menuReport.init(this.result.date)
		await this.loadGroups()
		await this.loadSettings()

		new ReportCardXlsxGenerator().generate(this.result)
	}

	private getDateobject() {
		return YMstringToDate(this.params.date)
	}

	private initDaysCount() {
		this.daysInMonthCount = moment(this.result.date).daysInMonth()
	}

	private async loadGroups() {
		const calendars = await this.fetchCalendars()

		const toSave = []
		for await (const calendar of calendars) {
			const group = await this.prepareXlsxGroup(calendar)
			toSave.push(group)
		}

		this.result.groups = toSave
	}

	private async fetchCalendars() {
		return this.repository.find({ date: this.params.date })
	}

	private async prepareXlsxGroup(calendar: IChildrenCalendarRecord) {
		const result: XlsxReportCardGroup = {
			group: null,
			calendar: calendar,
			items: [],
			summary: {},
		}

		result.group = await this.groupsRepository.findOne({
			_id: calendar.groupId,
		})

		result.items = await Promise.all(
			calendar.items.map(async item =>
				this.prepareXlsxGroupItem(item, result.group),
			),
		)

		result.summary = this.calcSummary(result.items)
		result.total = this.calcTotal(result.items)

		return result
	}

	private async prepareXlsxGroupItem(
		calendarItem: IChildrenCalendarChild,
		group: IGroup,
	) {
		const result: Partial<XlsxReportCardItem> = {
			values: {},
			presentCound: 0,
			bruttoSumm: 0,
		}
		const child = await this.childrenRepository.findOne({
			_id: calendarItem.childId,
		})
		if (!child) return null

		result.childrenName = child.name

		const visitingObj: Record<number, boolean> = {}

		calendarItem.visiting.map(it => {
			visitingObj[it.day] = it.isPresent
		})

		Array.from({ length: this.daysInMonthCount }, (_, i) => {
			const day = i + 1
			const isPresent = visitingObj[day]

			let summ = ''

			if (isPresent) {
				result.presentCound++

				const menuReportItem = this.menuReport.getMenu({
					groupCategoryKey: group.category,
					day: day,
				})
				if (menuReportItem) {
					summ = menuReportItem.oneChildSumm.toFixed(2)
					if (summ)
						result.bruttoSumm += Number(menuReportItem.oneChildSumm)
				}
			}
			result.values[day] = summ
		})

		result.nettoSumm = (60 / 100) * result.bruttoSumm

		if (Number(child.paymentPercent) === 50) {
			result.isPay50 = (50 / 100) * result.nettoSumm
		}
		if (Number(child.paymentPercent) === 0) {
			result.isPay0 = 0
		}
		if (Number(child.paymentPercent) !== 100)
			result.privilegeReason = child.halfPaymentReason

		return result as any
	}

	private async loadSettings() {
		const settings: any[] = await getFromStore('settings', 'list')
		const settingsObj: Record<string, string> = {}

		settings.map(it => {
			settingsObj[it.key] = it.value
		})

		this.result.setting = {
			name: settingsObj?.name,
			edrpoy: settingsObj?.edrpoy,
			daysInMonthCount: this.daysInMonthCount,
			director: settingsObj?.director,
		}
	}

	private calcSummary(items: XlsxReportCardGroup['items']) {
		const result: XlsxReportCardGroup['summary'] = {}

		for (let index = 1; index <= this.daysInMonthCount; index++) {
			let summ = 0
			let count = 0

			items.map(item => {
				const value = item.values[String(index)]
				if (value) {
					summ += Number(value)
					count++
				}
			})

			result[String(index)] = { summ, count }
		}

		return result
	}

	private calcTotal(items: XlsxReportCardGroup['items']) {
		const result: XlsxReportCardGroup['total'] = {
			visitingCount: 0,
			brutto: 0,
			netto: 0,
			isPay50: 0,
		}

		items.map(item => {
			result.visitingCount += Number(item.presentCound)
			result.brutto += Number(item.bruttoSumm)
			result.netto += Number(item.nettoSumm)
			if (item.isPay50) result.isPay50 += Number(item.isPay50)
		})

		return result
	}
}

// setTimeout(() => {
// 	new ReportCardXlsx().generate({ date: '2023/7' })
// }, 3000)
