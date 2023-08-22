import { API } from '@/shared/core'

class SettingsAPI extends API {
	protected basePath = 'settings'

	public openDbFolder() {
		this.call('openDbFolder', {})
	}
}

export const settingsAPI = new SettingsAPI()
