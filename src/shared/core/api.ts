import { appEvents } from '../events'

export class API {
	protected basePath: string

	protected async call(key: string, data: any) {
		const response = await window.Main.emit(this.createFullPath(key), data)

		appEvents.emit(`apiCall_${this.createFullPath(key)}` as any, {})

		return response
	}

	protected createFullPath(key: string) {
		return `${this.basePath}/${key}`
	}
}
