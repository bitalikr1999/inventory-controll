import _ from 'lodash'
import path from 'path'

import { dbCwd } from 'electron/config'
import { Repository } from 'electron/abstract/repository'

import { IGroup } from '@/@types/interfaces'

export const childrensGroupsRepository = Repository.create<IGroup>(
	path.join(dbCwd, 'childrens-groups.db'),
)
