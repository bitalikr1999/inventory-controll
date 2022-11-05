import { dbCwd } from 'electron/config'
import _ from 'lodash'
import path from 'path'

import { Repository } from 'electron/abstract/repository'
import { IChildren } from '@/@types/interfaces'

const Datastore = require('nedb')

const childrensDb = new Datastore({
	filename: path.join(dbCwd, 'childrens.db'),
	autoload: true,
	timestampData: true,
})

class ChildrensRepository extends Repository<IChildren> {
	constructor() {
		super(childrensDb)
	}
}

export const childrensRepository = new ChildrensRepository()
