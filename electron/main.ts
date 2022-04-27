import { app, BrowserWindow, ipcMain } from 'electron'
import { write } from 'fs'
import path from 'path'
import { getFromStore, setToStore } from './store'
import { initChildrensStoreListeners } from './store/childrens'
import { initMenusStoreListeners } from './store/menu'
const fs = require('fs')

let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

function createWindow() {
	const splashWin = new BrowserWindow({
		width: 200,
		height: 200,
		backgroundColor: '#fff',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: false,
		},
		transparent: true,
		frame: false,
		alwaysOnTop: true,
	})

	splashWin.loadFile(`${__dirname}/../../assets/loading.html`)
	splashWin.center()

	mainWindow = new BrowserWindow({
		width: 1100,
		height: 700,
		backgroundColor: '#fff',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
		show: false,
		title: 'Food Accounting',
	})

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

	setTimeout(() => {
		splashWin.close()
		mainWindow.show()
	}, 2000)

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

	initChildrensStoreListeners()
	initMenusStoreListeners()

	setTimeout(() => {
		ipcMain.emit('message', `${app.getPath('appData')}/test.txt`)
	}, 8000)
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

	const content = 'Some content!'

	fs.writeFile(`${app.getPath('appData')}/test.txt`, content, err => {
		if (err) {
			console.error(err)
			return
		}
		//file written successfully
	})
})
