import path from 'path'
import _ from 'lodash'

import { Repository } from 'electron/abstract'
import { dbCwd } from 'electron/config'

import { ISetting } from '@/@types/interfaces'

export const settingsRepository = Repository.create<ISetting>(
	path.join(dbCwd, 'settings.db'),
)
