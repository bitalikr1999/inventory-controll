import { ipcMain, shell } from 'electron'
import { dbCwd } from 'electron/config'

export const initSettingsListener = () => {
	ipcMain.handle('openDbFolder', async () => {
		shell.openPath(dbCwd)
	})
}
