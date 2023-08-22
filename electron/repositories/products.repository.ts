import path from 'path'
import _ from 'lodash'

import { Repository } from 'electron/abstract'
import { dbCwd } from 'electron/config'

import { IProduct } from '@/@types/interfaces'

export const productsRepository = Repository.create<IProduct>(
	path.join(dbCwd, 'products.db'),
)
