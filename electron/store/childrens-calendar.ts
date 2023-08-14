import { dbCwd } from 'electron/config'
import _ from 'lodash'
import path from 'path'

import { Repository } from 'electron/abstract/repository'
import { IChildren, IChildrenCalendarRecord } from '@/@types/interfaces'

const Datastore = require('nedb')

const db = new Datastore({
	filename: path.join(dbCwd, 'childrens-calendar.db'),
	autoload: true,
	timestampData: true,
})

class ChildrensCalendarRepository extends Repository<IChildrenCalendarRecord> {
	constructor() {
		super(db)
	}
}

export const childrensCalendarsRepository = new ChildrensCalendarRepository()
