import { GroupCategoryKey } from '@/@types/enums'
import { XlsxSheetGenerator } from 'electron/abstract'
import { GenerateZdoDataXlsx, GenerateZdoXlsx } from 'electron/typing'
import { XlsxProductsSummaryConfig } from './interface'
import { generateMerge } from './helpers/merge-cols.helper'
import { xlsxVal, xlsxValСenter } from 'electron/helpers'
import moment from 'moment'

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

		return [this.getName(), this.worksheet]
	}

	protected getName() {
		if (this.data.category === GroupCategoryKey.Junior) return '1-4р.'
		if (this.data.category === GroupCategoryKey.Middle) return '4-6р.'
		if (this.data.category === GroupCategoryKey.Senior) return 'Працівники.'
	}

	protected initConfig() {
		this.config = {
			startHead: [0, 3],
			startTitle: [9, 7],
			startResponsiblePerson: 11,
			daysInMonthCount: Number(this.settings.daysInMonthCount),
		}

		const childCount = this.data.items.length
		const tableHeadRowCount = 3 // start in this row
		const tableFooterRowCount = 2
		const summaryRowCount = 2
		const summarySpace = 2
		const footerSpaceFromSummary = 2

		this.config.startTableRow = this.config.startResponsiblePerson + 2
		this.config.startTableItemsRow =
			this.config.startTableRow + tableHeadRowCount

		this.config.endTableRow =
			this.config.startTableRow +
			tableHeadRowCount +
			childCount +
			tableFooterRowCount

		this.config.startTableSummaryRow =
			this.config.startTableRow +
			tableHeadRowCount +
			childCount +
			summarySpace

		this.config.startFooterRow =
			this.config.startTableSummaryRow +
			summaryRowCount +
			footerSpaceFromSummary

		console.log('thisconfig', this.config)
	}

	protected mergeCols() {
		this.worksheet['!merges'] = generateMerge(this.config)
	}

	protected sizes() {
		if (!this.config.startTableRow) return

		const colsSizes = [
			{ wpx: 24 },
			{ wpx: 159 },
			{ wpx: 45 },
			{ wpx: 75 },

			{ wpx: 93 },
			{ wpx: 88 },
		]

		for (
			let index = 0;
			index < this.settings.daysInMonthCount + 1;
			index++
		) {
			colsSizes.push({ wpx: 52 })
		}

		this.worksheet['!cols'] = colsSizes

		this.worksheet['!rows'] = [
			{ hpt: 17 },
			{ hpt: 14 },
			{ hpt: 12 },
			{ hpt: 19 },
			{ hpt: 19 },
			{ hpt: 19 },
			{ hpt: 16 },
			{ hpt: 22 },
			{ hpt: 14 },

			{ hpt: 14 }, //title
			{ hpt: 14 }, //title
			{ hpt: 22 }, //title
			{ hpt: 15 }, //title space

			{ hpt: 21 },
			{ hpt: 24 },
			{ hpt: 38 },
		]
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

	protected writeTitle() {
		this.writeData(this.transformFromCords(this.config.startTitle), [
			[xlsxValСenter('Відомість № 1', false, 16)],
			[
				xlsxValСenter(
					`з витрачання продуктів харчування todo `,
					false,
					14,
				),
			],
			[
				xlsxValСenter(
					moment(this.date).format('за MMMM YYYY року'),
					false,
					14,
				),
			],
		])
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
			xlsxVal('790', false, 11),
		]

		for (let index = 0; index < this.settings.daysInMonthCount; index++) {
			head2RowData.push(xlsxValСenter(30, false, 11))
		}

		this.writeData(
			this.transformFromCords([3, this.config.startTableRow + 1]),
			[head2RowData],
		)

		this.writeData(
			this.transformFromCords([3, this.config.startTableRow + 2]),
			[
				[
					xlsxVal('Витрачено', false, 11),
					xlsxVal('Вартість за одиницю', false, 11),
					xlsxVal('Сума,грн', false, 11),
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

		console.log('items', this.data.items)
		this.data.items.map(item => {
			const rowData = [
				xlsxVal(item.name, false, 11),
				,
				xlsxValСenter(item.measurmentUnit, false, 11),
				xlsxValСenter(Number(item.totalCount).toFixed(2), false, 11),
				xlsxValСenter(Number(item.price).toFixed(2), false, 11),
				xlsxValСenter(Number(item.totalPrice).toFixed(2), false, 11),
			]

			item.byDays.map(it2 => {
				if (it2.count > 0)
					rowData.push(xlsxValСenter(Number(it2.count).toFixed(2)))
				else rowData.push(xlsxVal(''))
			})
			data.push(rowData)
		})

		this.writeData(
			this.transformFromCords([0, this.config.startTableItemsRow]),
			data,
		)
	}
}
