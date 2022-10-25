import { app } from 'electron'
import path from 'path'

export const dbCwd = path.join(app.getPath('appData'), 'foodAccountingData')
export const publicCwd = path.join(app.getPath('documents'))

export * from './groups-labels.config'
