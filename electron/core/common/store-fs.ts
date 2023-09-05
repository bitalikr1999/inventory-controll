import { storeCwd } from 'electron/config'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'

export class StoreFs {
	static rootPath = storeCwd
	static backupsFolderName = 'backups'
	static dbFolderName = 'db'

	public static initFolders() {
		this.initBackupsFolder()
		this.initDbFolder()
	}

	private static initBackupsFolder() {
		this.initFolder(this.backupsFolderName)
	}

	private static initDbFolder() {
		this.initFolder(this.dbFolderName)
	}

	private static initFolder(name: string) {
		const path = this.getPath(name)
		if (existsSync(path)) return

		mkdirSync(path)
	}

	private static getPath(name: string) {
		return path.join(this.rootPath, name)
	}
}
