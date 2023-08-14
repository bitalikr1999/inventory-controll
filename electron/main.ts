import { app, BrowserWindow, ipcMain } from 'electron'
import {
	initChildrensCalendarsListener,
	initChildrensListener,
	initMenusStoreListeners,
	initSettingsListener,
	initZdoListeners,
} from './listeners'
import { getFromStore, setToStore } from './store'
import { initWarehouseListeners } from './store/warehouse'

let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 700,
		backgroundColor: '#fff',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			devTools: true,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
		show: false,
		title: 'Warehouse',
	})

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
	mainWindow.show()

	mainWindow.webContents.openDevTools()

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

async function registerListeners() {
	ipcMain.handle('getStore', (_, store: string, key: string) => {
		return getFromStore(store as any, key)
	})

	ipcMain.handle('setToStore', (_, store: string, key: string, data: any) => {
		return setToStore(store as any, key, data)
	})

	ipcMain.handle('openDevTooles', () => {
		mainWindow.webContents.openDevTools()
	})

	initChildrensListener()
	initMenusStoreListeners()
	initZdoListeners()
	initWarehouseListeners()
	initChildrensCalendarsListener()
	initSettingsListener()
}

app.on('ready', createWindow)
	.whenReady()
	.then(registerListeners)
	.catch(e => console.error(e))

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
