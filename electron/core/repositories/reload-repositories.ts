import { RepositoriesList } from '../common'

export class ReloadRepositories {
	static run(repositoriesList: RepositoriesList) {
		repositoriesList.get().map(repo => {
			repo.reload()
		})
	}
}
