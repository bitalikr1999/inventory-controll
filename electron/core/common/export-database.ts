import { Repository } from 'electron/abstract'
import { RepositoriesList } from './repositories-list'
import { promises as fsPromises } from 'fs'
import fs from 'fs'
import { getFileNameFromUrl } from 'electron/helpers/url'
import path from 'path'
import { publicCwd } from 'electron/config'
import JSZip from 'jszip'
import { shell } from 'electron'

export class ExportDatabase {
	private zip: typeof JSZip
	private folder: any
	private folderName = 'data'
	private filesPaths: string[] = []
	private outputFilePath: string

	constructor(private repositoriesList: RepositoriesList) {}

	public async export() {
		this.createJSZip()
		this.createFolderInZip()
		this.getOutputFilePath()
		this.getFilesPaths()
		await this.appendFilesToFolder()
		await this.outputZip()

		return this
	}

	public openOutputFile() {
		shell.showItemInFolder(this.outputFilePath)
		return this
	}

	private createJSZip() {
		this.zip = new JSZip()
	}

	private createFolderInZip() {
		this.folder = this.zip.folder(this.folderName)
	}
	private getFilesPaths() {
		this.filesPaths = this.repositoriesList.get().map(item => item.path)
	}

	private async appendFilesToFolder() {
		for await (const path of this.filesPaths) {
			await this.appendFileToFolder(path)
		}
	}

	private async appendFileToFolder(path: string) {
		try {
			const file = await this.readFile(path)
			this.folder.file(getFileNameFromUrl(path), file)
		} catch (e) {
			console.log(e)
		}
	}

	private async readFile(path: string) {
		try {
			const data = await fsPromises.readFile(path)
			return data
		} catch (e) {
			throw new Error('File not exist')
		}
	}

	private outputZip() {
		return new Promise((resolve, reject) => {
			this.zip
				.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
				.pipe(fs.createWriteStream(this.outputFilePath))
				.on('finish', resolve)
				.on('error', reject)
		})
	}

	private getOutputFilePath() {
		this.outputFilePath = path.join(
			publicCwd,
			this.generateOutputFileName(),
		)
	}

	private generateOutputFileName() {
		const date = new Date()
		return `warehousedb_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}.zip`
	}
}

setTimeout(async () => {
	const exportDatabase = new ExportDatabase(
		RepositoriesList.createWithAllRepositories(),
	)
	await exportDatabase.export()
	exportDatabase.openOutputFile()
}, 3000)
