import { ipcMain } from 'electron'

type Path = string

export abstract class Controller {
	protected abstract basePath: string
	protected abstract routes: Record<Path, (_: any, params: unknown) => any>

	public listen() {
		this.initRoutesHandlers()
	}

	private initRoutesHandlers() {
		Object.keys(this.routes).map(this.initRouteHandler.bind(this))
	}

	private initRouteHandler(path: string) {
		ipcMain.handle(
			this.generateFullPath(path),
			this.routes[path].bind(this),
		)
	}

	private generateFullPath(path: string) {
		return `${this.basePath}/${path}`
	}
}
