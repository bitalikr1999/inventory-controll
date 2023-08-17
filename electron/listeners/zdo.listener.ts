import { ipcMain } from 'electron'
import { generateMenusXlsx } from 'electron/xlsx/menu'
import { GenerateZdoXlsx, generateZdoXlsx } from 'electron/xlsx/zdo'
import 'electron/core/products/products-summary-xlsx'
export const initZdoListeners = () => {
	ipcMain.handle('generateZdo', (_, data: GenerateZdoXlsx) => {
		generateZdoXlsx(data)
	})

	ipcMain.handle('generateMenu', (_, data: any) => {
		generateMenusXlsx(data)
	})
}
