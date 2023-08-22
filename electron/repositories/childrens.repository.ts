import path from 'path'
import _ from 'lodash'

import { dbCwd } from 'electron/config'
import { Repository } from 'electron/abstract/repository'

import { IChildren } from '@/@types/interfaces'

export const childrensRepository = Repository.create<IChildren>(
	path.join(dbCwd, 'childrens.db'),
)
