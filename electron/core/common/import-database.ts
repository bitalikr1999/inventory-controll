import { backupsCwd, dbCwd, publicCwd } from 'electron/config'
import { promises as fsPromises } from 'fs'
import JSZip from 'jszip'
import path from 'path'
import fs from 'fs'
import { noop } from 'lodash'
import { ExportDatabase } from './export-database'
import { RepositoriesList } from './repositories-list'
import { ReloadRepositories } from '../repositories'

export class ImportDatabase {
	protected zipFile: JSZip
	protected outputFolder: string
	protected copyFilePath: string

	constructor(protected zipFilepath: string) {}

	public async import() {
		await this.initZipFile()
		await this.createSafeCopy()
		await this.clearDbFolder()
		await this.writeFilesToDbFolder()

		ReloadRepositories.run(RepositoriesList.createWithAllRepositories())
	}

	private async createSafeCopy() {
		const exportDatabase = new ExportDatabase(
			RepositoriesList.createWithAllRepositories(),
		).setFilenameFormatter(ExportDatabase.createTimeBasedName)

		await exportDatabase.exportToFolder(backupsCwd)

		this.copyFilePath = exportDatabase.getOutputFilePath()
	}

	private async initZipFile() {
		const file = await this.uploadZipFile()
		this.zipFile = file
	}

	private async uploadZipFile(): Promise<JSZip> {
		return new Promise(async (resolve, reject) => {
			const file = await fsPromises.readFile(this.zipFilepath)
			JSZip.loadAsync(file).then(function (zip) {
				resolve(zip)
			})
		})
	}

	private async clearDbFolder() {
		const files = await fsPromises.readdir(dbCwd)

		for await (const fileUrl of files) {
			await fsPromises.unlink(path.join(dbCwd, fileUrl)).catch(noop)
		}
	}

	private async writeFilesToDbFolder() {
		const files = this.zipFile.files
		const keys = Object.keys(files)

		for await (const key of keys) {
			await this.writeFile(files[key])
		}
	}

	private async writeFile(file: JSZip.JSZipObject) {
		if (file.dir) return
		const fileName = file.name.replace('data/', '')
		if (!fileName) return

		await this.processStreamToFile(
			file.nodeStream(),
			path.join(dbCwd, fileName),
		)
	}

	private async processStreamToFile(
		stream: NodeJS.ReadableStream,
		filePath: string,
	) {
		console.log('start write stream', stream, filePath)
		const writableStream = fs.createWriteStream(filePath)

		return new Promise((resolve, reject) => {
			stream.pipe(writableStream)

			writableStream.on('finish', () => {
				resolve(null)
			})

			writableStream.on('error', error => {
				console.log('error write stream', error)
				reject(error)
			})
		})
	}
}
