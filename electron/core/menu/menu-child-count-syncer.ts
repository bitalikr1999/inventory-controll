import { menusRepository } from 'electron/repositories'
import { MenuReport } from './menu-report'
import { YMstringToDate } from 'electron/helpers/date'

export class MenuChildCountSyncer {
	static async syncByYMDateString(ymdate: string) {
		const menuReport = new MenuReport()
		const date = YMstringToDate(ymdate)
		await menuReport.init(date)

		const preparedMenus = menuReport.getPreparedMenus()

		for await (const preparedMenu of preparedMenus) {
			const existMenu = await menusRepository.findOne(
				preparedMenu.menu._id,
			)
			if (existMenu.childrensCount !== preparedMenu.menu.childrensCount) {
				await menusRepository.updateOne(
					{ _id: existMenu._id },
					{ childrensCount: preparedMenu.menu.childrensCount },
				)
			}
		}
	}
}
