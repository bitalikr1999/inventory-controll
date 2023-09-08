import { app, BrowserWindow } from 'electron'
import { registerListeners } from './listeners'

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
		title: 'Silo',
	})

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
	mainWindow.maximize()
	mainWindow.show()

	// mainWindow.webContents.openDevTools()

	mainWindow.on('closed', () => {
		mainWindow = null
	})
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
