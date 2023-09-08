import { API } from '@/shared/core'
import { IPutSettingsPayload } from 'electron/typing'

class SettingsAPI extends API {
	protected basePath = 'settings'

	public openDbFolder() {
		this.call('openDbFolder', {})
	}

	public importDatabase(filepath: string) {
		this.call('importDatabase', { filepath })
	}

	public exportDatabase() {
		this.call('exportDatabase', {})
	}

	public put(payload: IPutSettingsPayload) {
		this.call('put', payload)
	}

	public getAll() {
		return this.call('getAll', {})
	}
}

export const settingsAPI = new SettingsAPI()
