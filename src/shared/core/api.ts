export class API {
	protected basePath: string

	protected call(key: string, data: any) {
		return window.Main.emit(this.createFullPath(key), data)
	}

	protected createFullPath(key: string) {
		return `${this.basePath}/${key}`
	}
}
