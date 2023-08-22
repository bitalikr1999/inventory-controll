import { dbCwd } from 'electron/config'
import _ from 'lodash'
import path from 'path'

import { Repository } from 'electron/abstract/repository'
import { IChildrenCalendarRecord } from '@/@types/interfaces'

export const childrensCalendarsRepository =
	Repository.create<IChildrenCalendarRecord>(
		path.join(dbCwd, 'childrens-calendar.db'),
	)
