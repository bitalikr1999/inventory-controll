import { app, BrowserWindow, ipcMain } from 'electron'
import { getFromStore, setToStore } from './store'
import {
	ChildrensCalendarsController,
	ChildrensController,
	ChildrensGroupsController,
	MenusController,
	ProductsController,
	SettingsController,
	WarehouseController,
	WarehouseHistoryController,
} from './controllers'
import './core/common/export-database'
import { StoreFs } from './core/common/store-fs'

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
	StoreFs.initFolders()

	ipcMain.handle('getStore', (_, store: string, key: string) => {
		return getFromStore(store as any, key)
	})

	ipcMain.handle('setToStore', (_, store: string, key: string, data: any) => {
		return setToStore(store as any, key, data)
	})

	new ChildrensCalendarsController().listen()
	new ChildrensController().listen()
	new ChildrensGroupsController().listen()

	new SettingsController().listen()
	new ProductsController().listen()

	new WarehouseHistoryController().listen()
	new WarehouseController().listen()

	new MenusController().listen()
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
