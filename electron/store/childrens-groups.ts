import { dbCwd } from 'electron/config'
import _ from 'lodash'
import path from 'path'

import { Repository } from 'electron/abstract/repository'
import { IGroup } from '@/@types/interfaces'
const Datastore = require('nedb')

const childrensGroupsDb = new Datastore({
	filename: path.join(dbCwd, 'childrens-groups.db'),
	autoload: true,
	timestampData: true,
})

class ChildrensGroupsRepository extends Repository<IGroup> {
	constructor() {
		super(childrensGroupsDb)
	}
}

export const childrensGroupsRepository = new ChildrensGroupsRepository()
