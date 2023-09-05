import { shell } from 'electron'
import { Controller } from 'electron/abstract'
import { dbCwd, storeCwd } from 'electron/config'
import { ImportDatabase } from 'electron/core/common'

export class SettingsController extends Controller {
	protected basePath = 'settings'
	protected routes = {
		openDbFolder: this.openDbFolder,
		importDatabase: this.importDatabase,
	}

	protected openDbFolder() {
		shell.openPath(storeCwd)
	}

	protected importDatabase(_: any, data: any) {
		console.log('data', data)

		new ImportDatabase(data.filepath).import()
	}
}
