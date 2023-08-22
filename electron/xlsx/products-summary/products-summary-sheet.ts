import { GroupCategoryKey } from '@/@types/enums'
import { XlsxSheetGenerator } from 'electron/abstract'
import {
	GenerateZdoDataXlsx,
	GenerateZdoXlsx,
	ZdoTableItem,
} from 'electron/typing'
import { XlsxProductsSummaryConfig } from './interface'
import { generateMerge } from './helpers/merge-cols.helper'
import { xlsxVal, xlsxValRight, xlsxValСenter } from 'electron/helpers'
import moment from 'moment'
import { calcConfig, calcSizes } from './helpers'

export class ProductsSummarySheetXlsxGenerator extends XlsxSheetGenerator {
	private data: GenerateZdoXlsx
	private date: Date
	private settings: GenerateZdoDataXlsx
	private config: XlsxProductsSummaryConfig

	public generate(
		item: GenerateZdoXlsx,
		date: Date,
		settings: GenerateZdoDataXlsx,
	) {
		this.data = item
		this.date = date
		this.settings = settings

		this.initWorksheet()
		this.initConfig()
		this.mergeCols()
		this.sizes()
		this.writeHead()
		this.writeTitle()
		this.writeResponsiblePerson()
		this.writeTableHead()
		this.writeItems()
		this.writeItemsSummary()
		this.writeFooter()
		this.writeOrder()

		return [this.getName(), this.worksheet]
	}

	protected getName() {
		if (this.data.category === GroupCategoryKey.Junior) return '1-4р.'
		if (this.data.category === GroupCategoryKey.Middle) return '4-6р.'
		if (this.data.category === GroupCategoryKey.Senior) return 'Працівники.'
		return 'Зведена'
	}

	protected initConfig() {
		this.config = calcConfig(this.data, this.settings)
	}

	protected mergeCols() {
		this.worksheet['!merges'] = generateMerge(this.config)
	}

	protected sizes() {
		const { cols, rows } = calcSizes(this.data, this.settings)
		this.worksheet['!cols'] = cols
		this.worksheet['!rows'] = rows
	}

	protected writeHead() {
		this.writeData(this.transformFromCords(this.config.startHead), [
			[xlsxVal(this.settings.name, false, 11)],
			[xlsxVal('(найменування юридичної особи)', false, 8)],
			[xlsxVal('Ідентифікаційний ', false, 11)],
			[
				xlsxVal('код ЄДРПОУ', false, 11),
				,
				xlsxVal(this.settings.edrpoy, false, 11, { bold: true }),
			],
		])
	}

	protected getNotorietyNumber() {
		const vals = {
			[GroupCategoryKey.Junior]: '1',
			[GroupCategoryKey.Middle]: '2',
			[GroupCategoryKey.Senior]: '3',
		}
		if (!this.data.category) return '4'
		return vals[this.data.category]
	}

	protected writeTitle() {
		this.writeData(this.transformFromCords(this.config.startTitle), [
			[
				xlsxValСenter(
					`Відомість № ${this.getNotorietyNumber()}`,
					false,
					16,
				),
			],
			[xlsxValСenter(this.getTitleLabel(), false, 14)],
			[
				xlsxValСenter(
					moment(this.date).format('за MMMM YYYY року'),
					false,
					14,
				),
			],
		])
	}

	protected getTitleLabel() {
		const start = `з витрачання продуктів харчування `
		switch (this.data.category) {
			case GroupCategoryKey.Junior:
				return `${start} дітей 1-4р.`
			case GroupCategoryKey.Middle:
				return `${start} дітей 4-6р.`
			case GroupCategoryKey.Senior:
				return `${start} працівників.`
			default:
				return `${start} зведена`
		}
	}

	protected writeResponsiblePerson() {
		this.writeData(
			this.transformFromCords([0, this.config.startResponsiblePerson]),
			[
				[
					xlsxVal('Матеріально відповідальна  особа: ', false, 11),
					,
					,
					xlsxVal(this.settings.responsiblePersonName, false, 11),
				],
				[
					,
					,
					,
					,
					xlsxValСenter(
						`(посада, власне ім'я та ПРІЗВИЩЕ)`,
						false,
						10,
					),
				],
			],
		)
	}

	protected writeTableHead() {
		const head1RowData = [
			xlsxVal('Найменування продуктів харчування', false, 11),
			,
			xlsxVal('Од. виміру', false, 11),
			xlsxVal('Числа місяця', false, 11),
			,
			,
		]

		for (let index = 0; index < this.settings.daysInMonthCount; index++) {
			head1RowData.push(xlsxValСenter(index + 1, false, 11))
		}

		this.writeData(
			this.transformFromCords([0, this.config.startTableRow]),
			[head1RowData],
		)

		const head2RowData = [
			xlsxVal('Кількість одержувачів', false, 11),
			,
			xlsxVal(Number(this.data.numberOfRecipients), false, 11),
		]

		for (let index = 0; index < this.settings.daysInMonthCount; index++) {
			head2RowData.push(
				xlsxValСenter(
					this.data.numberOfRecipientsByDays[index + 1],
					false,
					11,
				),
			)
		}

		this.writeData(
			this.transformFromCords([3, this.config.startTableRow + 1]),
			[head2RowData],
		)

		this.writeData(
			this.transformFromCords([3, this.config.startTableRow + 2]),
			[
				[
					xlsxValСenter('Витрачено', false, 11),
					xlsxValСenter('Вартість за одиницю', false, 11),
					xlsxValСenter('Сума,грн', false, 11),
					xlsxValСenter(
						'Кількість витрачених продуктів харчування',
						false,
						14,
					),
				],
			],
		)
	}

	protected writeItems() {
		const data: any[] = []

		this.data.items.map(item => {
			const rowData = [
				xlsxVal(item.name, false, 11),
				,
				xlsxValСenter(item.measurmentUnit, false, 11),
				xlsxValСenter(
					this.prepareNumberVal(item.totalCount),
					false,
					11,
				),
				xlsxValСenter(this.prepareNumberVal(item.price), false, 11),
				xlsxValСenter(
					this.prepareNumberVal(item.totalPrice),
					false,
					11,
				),
			]

			item.byDays.map(it2 => {
				if (it2.count > 0)
					rowData.push(
						xlsxValСenter(this.prepareNumberVal(it2.count)),
					)
				else rowData.push(xlsxVal(''))
			})
			data.push(rowData)
		})

		this.writeData(
			this.transformFromCords([0, this.config.startTableItemsRow]),
			data,
		)
	}

	protected writeItemsSummary() {
		const val = (val: string) =>
			xlsxValRight(val, false, 11, { bold: true })

		const totalRow: any[] = [
			val('РАЗОМ'),
			,
			,
			,
			,
			val(this.prepareNumberVal(this.data.totalBruto)),
		]

		const freeRow: any[] = [
			val('БЕЗКОШТОВНО'),
			,
			,
			,
			,
			val(this.prepareNumberVal(this.data.totalFree)),
		]

		const nettoRow: any[] = [
			val('ЗА ОПЛАТОЮ'),
			,
			,
			,
			,
			val(this.prepareNumberVal(this.data.totalNetto)),
		]

		for (let index = 1; index <= this.settings.daysInMonthCount; index++) {
			const result = {
				brutto: 0,
				free: 0,
				netto: 0,
			}

			this.data.items.map(item => {
				const byDay = item.byDays.find(it => it.date === index)
				result.brutto += Number(byDay.summ)
				result.free += Number(byDay.freeSumm)
				result.netto += Number(byDay.summ) - Number(byDay.freeSumm)
			})

			totalRow.push(
				xlsxValСenter(this.prepareNumberVal(result.brutto), false, 11),
			)
			freeRow.push(
				xlsxValСenter(this.prepareNumberVal(result.free), false, 11),
			)
			nettoRow.push(
				xlsxValСenter(this.prepareNumberVal(result.netto), false, 11),
			)
		}

		this.writeData(
			this.transformFromCords([0, this.config.startTableSummaryRow]),
			[totalRow, freeRow, nettoRow],
		)
	}

	protected writeFooter() {
		this.writeData(
			this.transformFromCords([1, this.config.startFooterRow]),
			[
				[
					xlsxValRight('Додається', false, 11),
					xlsxValСenter('', false, 11),
					xlsxVal(''),
					xlsxVal(''),
					xlsxVal('штук меню-вимог', false, 11),
				],
				[
					xlsxValRight('Склав:', false, 11),
					xlsxValСenter('комірник', false, 11),
					xlsxVal(''),
					xlsxVal(''),
					xlsxVal(this.settings.storekeeper),
				],
				[
					xlsxVal(''),
					xlsxValСenter('(посада)', false, 10),
					xlsxVal(''),
					xlsxValСenter('(підпис)', false, 10),
				],
				[
					xlsxValRight('Перевірив:', false, 11),
					xlsxValСenter('директор', false, 11),
					xlsxVal(''),
					xlsxVal(''),
					xlsxVal(this.settings.director),
				],
				[
					xlsxVal(''),
					xlsxValСenter('(посада)', false, 10),
					xlsxVal(''),
					xlsxValСenter('(підпис)', false, 10),
				],
			],
		)
	}

	protected writeOrder() {
		this.writeData(this.transformFromCords(this.config.startOrderInfo), [
			[xlsxValRight('ЗАТВЕРДЖЕНО', false, 11)],
			[xlsxValRight('Наказ Міністерства фінансів України', false, 11)],
			[xlsxValRight('13 грудня 2022 року № 431', false, 11)],
		])
	}
}
