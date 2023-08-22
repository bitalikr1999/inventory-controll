import path from 'path'
import _ from 'lodash'

import { Repository } from 'electron/abstract'
import { dbCwd } from 'electron/config'

import { IWarehouseHistoryRecord } from '@/@types/interfaces'

export const warehouseHistoryRepository =
	Repository.create<IWarehouseHistoryRecord>(
		path.join(dbCwd, 'warehouse-history.db'),
	)
