import { shell } from 'electron'
import { Controller } from 'electron/abstract'
import { dbCwd, storeCwd } from 'electron/config'
import {
	ExportDatabase,
	ImportDatabase,
	RepositoriesList,
} from 'electron/core/common'
import { settingsRepository } from 'electron/repositories'
import { IPutSettingsPayload } from 'electron/typing'

export class SettingsController extends Controller {
	protected basePath = 'settings'
	protected routes = {
		openDbFolder: this.openDbFolder,
		importDatabase: this.importDatabase,
		exportDatabase: this.exportDatabase,
		put: this.put,
		getAll: this.getAll,
	}

	protected openDbFolder() {
		shell.openPath(storeCwd)
	}

	protected importDatabase(_: any, data: any) {
		new ImportDatabase(data.filepath).import()
	}

	protected async exportDatabase() {
		const exportDatabase = new ExportDatabase(
			RepositoriesList.createWithAllRepositories(),
		)
		await exportDatabase.export()
		exportDatabase.openOutputFile()
	}

	protected async put(_: any, data: IPutSettingsPayload) {
		const keys = data.items.map(it => it.key)
		await this.clearPrevious(keys)

		await settingsRepository.db.insert(data.items)
	}

	protected async clearPrevious(keys: string[]) {
		for await (const key of keys) {
			try {
				await settingsRepository.db.remove({ key })
			} catch (e) {}
		}
	}

	protected getAll() {
		return settingsRepository.find({})
	}
}
