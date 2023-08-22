import { shell } from 'electron'
import { Controller } from 'electron/abstract'
import { dbCwd } from 'electron/config'

export class SettingsController extends Controller {
	protected basePath = 'settings'
	protected routes = {
		openDbFolder: this.openDbFolder,
	}

	protected openDbFolder() {
		shell.openPath(dbCwd)
	}
}
