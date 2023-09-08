import { Repository } from 'electron/abstract'
import {
	childrensCalendarsRepository,
	childrensGroupsRepository,
	childrensRepository,
	menusRepository,
	productsRepository,
	settingsRepository,
	warehouseHistoryRepository,
	warehouseRepository,
} from 'electron/repositories'

export class RepositoriesList {
	constructor(private repositories: Repository<unknown>[] = []) {}

	public registerRepository(repository: Repository<unknown>) {
		this.repositories.push(repository)
	}

	public get() {
		return Array.isArray(this.repositories) ? this.repositories : []
	}

	static createWithAllRepositories() {
		const repositories = [
			childrensCalendarsRepository,
			childrensGroupsRepository,
			childrensRepository,
			productsRepository,
			warehouseHistoryRepository,
			warehouseRepository,
			menusRepository,
			settingsRepository,
		]

		const repositoriesList = new RepositoriesList(repositories)

		return repositoriesList
	}
}
