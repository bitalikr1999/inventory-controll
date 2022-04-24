import { contextBridge, ipcRenderer } from 'electron'

export const api = {
	/**
	 * Here you can expose functions to the renderer process
	 * so they can interact with the main (electron) side
	 * without security problems.
	 *
	 * The function below can accessed using `window.Main.sendMessage`
	 */

	sendMessage: (message: string) => {
		ipcRenderer.send('message', message)
	},

	emit: (key: string, data: any) => {
		return ipcRenderer.invoke(key, data)
	},

	send: (key: string, data: any) => {
		return ipcRenderer.send(key, data)
	},

	getStore: (store: string, key: string) => {
		return ipcRenderer.invoke('getStore', store, key)
	},

	setToStore: (store: string, key: string, data: any) => {
		return ipcRenderer.invoke('setToStore', store, key, data)
	},
	/**
	 * Provide an easier way to listen to events
	 */
	on: (channel: string, callback: Function) => {
		ipcRenderer.on(channel, (_, data) => callback(data))
	},
}

contextBridge.exposeInMainWorld('Main', api)
