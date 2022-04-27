import { app } from 'electron'
import path from 'path'

export const dbCwd = path.join(app.getPath('appData'), 'foodAccountingData')
