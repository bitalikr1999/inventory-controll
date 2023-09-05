import { app } from 'electron'
import path from 'path'

export const storeCwd = path.join(app.getPath('appData'), '_warehouse_data')
export const dbCwd = path.join(storeCwd, 'db')
export const backupsCwd = path.join(storeCwd, 'backups')

export const publicCwd = path.join(app.getPath('documents'))

export * from './groups-labels.config'
