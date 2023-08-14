import { GroupCategoryKey } from '@/@types/enums'
import { IChildren, IChildrenCalendarChild } from '@/@types/interfaces'
import { childrensCalendarsRepository } from 'electron/store/childrens-calendar'
import { childrensGroupsRepository } from 'electron/store/childrens-groups'
import { ICountChildrenCountParams } from 'electron/typing'

export class ChildrenCounter {
	private params: ICountChildrenCountParams
	private repository = childrensCalendarsRepository
	private groupsRepository = childrensGroupsRepository

	public setParams(params: ICountChildrenCountParams) {
		this.params = params
		return this
	}

	public async calc() {
		const children = await this.getChildren()

		let result = 0

		children.map(it => {
			if (this.checkIsChildWasPresent(it, this.params.day)) {
				result++
			}
		})
		console.log('count children', result)

		return result
	}

	private async getChildren() {
		const calendars = await this.getCalendars()

		console.log(calendars)
		const children: IChildrenCalendarChild[] = []

		calendars.map(it => children.push(...it.items))
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

			console.log('groupsIds', groupsIds)
			if (!groupsIds.length) return []

			options.groupId = { $in: groupsIds }
		}
		if (this.params.date) {
			options.date = this.params.date
		}

		console.log('options', options)

		const calendars = await this.repository.find(options)

		return calendars
	}

	private async getGroupsIdsByCategory(groupCategory: GroupCategoryKey) {
		const groups = await this.groupsRepository.find({
			category: groupCategory,
		})

		console.log('groups', groupCategory, groups)

		return groups.map(it => it._id)
	}
}
