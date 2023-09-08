import {
	ChildrensCalendarsController,
	ChildrensController,
	ChildrensGroupsController,
	SettingsController,
	ProductsController,
	WarehouseHistoryController,
	WarehouseController,
	MenusController,
} from './controllers'
import { StoreFs } from './core/common/store-fs'

export async function registerListeners() {
	StoreFs.initFolders()

	new ChildrensCalendarsController().listen()
	new ChildrensController().listen()
	new ChildrensGroupsController().listen()

	new SettingsController().listen()
	new ProductsController().listen()

	new WarehouseHistoryController().listen()
	new WarehouseController().listen()

	new MenusController().listen()
}
