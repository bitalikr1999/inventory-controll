import {
	IChildrenCalendarChild,
	IChildrenCalendarRecord,
	IGroup,
} from '@/@types/interfaces'
import { childrensRepository } from 'electron/store/childrens'
import { childrensCalendarsRepository } from 'electron/store/childrens-calendar'
import { childrensGroupsRepository } from 'electron/store/childrens-groups'
import { IGenerateXlsxReportCardParams } from 'electron/typing'

import { MenuReport } from '../menu/menu-report'
import moment from 'moment'
import {
	ReportCardXlsxGenerator,
	XlsxReportCardData,
	XlsxReportCardGroup,
	XlsxReportCardItem,
} from 'electron/xlsx/report-card'

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
		},
	}

	public async generate(params: IGenerateXlsxReportCardParams) {
		this.params = params
		this.menuReport = new MenuReport()
		this.initDaysCount()

		await this.menuReport.init()
		await this.loadGroups()
		await this.loadSettings()

		this.result.date = this.getDateobject()

		new ReportCardXlsxGenerator().generate(this.result)
	}

	private getDateobject() {
		const year = this.params.date.split('/')[0]
		const month = this.params.date.split('/')[1]
		const date = new Date()
		date.setFullYear(Number(year))
		date.setMonth(Number(month))
		return date
	}

	private initDaysCount() {
		const date = this.getDateobject()

		this.daysInMonthCount = moment(new Date(date)).daysInMonth()
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
		this.result.setting = {
			name: 'Центр розвитку дитини "Пролісок"',
			edrpoy: '26431648',
			daysInMonthCount: this.daysInMonthCount,
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

		console.log('Summary result', result)

		return result
	}
}