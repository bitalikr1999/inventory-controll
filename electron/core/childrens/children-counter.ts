import { GroupCategoryKey } from '@/@types/enums'
import { IChildrenCalendarChild } from '@/@types/interfaces'
import {
	childrensCalendarsRepository,
	childrensGroupsRepository,
} from 'electron/repositories'
import { ICountChildrenCountParams } from 'electron/typing'

export class ChildrenCounter {
	private params: ICountChildrenCountParams
	private repository = childrensCalendarsRepository
	private groupsRepository = childrensGroupsRepository
	private children: IChildrenCalendarChild[]

	public setParams(params: ICountChildrenCountParams) {
		this.params = params
		return this
	}

	public async preload() {
		const children = await this.getChildren()
		this.children = children
	}

	public getCount(day: number) {
		const checker = (it: any) => this.checkIsChildWasPresent(it, day)
		return this.countByChecker(this.children, checker)
	}

	public getCountByCategory(day: number, category: GroupCategoryKey) {
		const checker = (it: any) => {
			if (it.groupCategory !== category) return false
			return this.checkIsChildWasPresent(it, day)
		}
		return this.countByChecker(this.children, checker)
	}

	public async calc() {
		const children = await this.getChildren()
		const checker = (it: any) => {
			return this.checkIsChildWasPresent(it, this.params.day)
		}
		return this.countByChecker(children, checker)
	}

	private countByChecker(children: any[], checker: (it: any) => boolean) {
		try {
			let result = 0

			children.map(it => {
				if (checker(it)) result++
			})

			return result
		} catch (e) {
			console.log(e)
			return 0
		}
	}

	private async getChildren() {
		const calendars = await this.getCalendars()
		const children: IChildrenCalendarChild[] = []

		await Promise.all(
			calendars.map(async it => {
				const group = await this.groupsRepository.findOne({
					_id: it.groupId,
				})
				const toPush = it.items.map(item => {
					return {
						...item,
						groupCategory: group.category,
					}
				})
				children.push(...toPush)
			}),
		)

		return children
	}

	private checkIsChildWasPresent(child: IChildrenCalendarChild, day: number) {
		try {
			const visiting = child.visiting.find(
				it => String(it.day) === String(day),
			)

			return visiting.isPresent
		} catch (e) {
			return false
		}
	}

	private async getCalendars() {
		const options: any = {}

		if (this.params.groupCategory) {
			const groupsIds = await this.getGroupsIdsByCategory(
				this.params.groupCategory,
			)

			if (!groupsIds.length) return []

			options.groupId = { $in: groupsIds }
		}
		if (this.params.date) {
			options.date = this.params.date
		}

		const calendars = await this.repository.find(options)

		return calendars
	}

	private async getGroupsIdsByCategory(groupCategory: GroupCategoryKey) {
		const groups = await this.groupsRepository.find({
			category: groupCategory,
		})

		return groups.map(it => it._id)
	}
}
