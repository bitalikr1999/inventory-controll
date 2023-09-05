import { API } from '@/shared/core'

class SettingsAPI extends API {
	protected basePath = 'settings'

	public openDbFolder() {
		this.call('openDbFolder', {})
	}

	public importDatabase(filepath: string) {
		this.call('importDatabase', { filepath })
	}
}

export const settingsAPI = new SettingsAPI()
