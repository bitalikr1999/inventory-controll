import path from 'path'
const Store = require('electron-store')

const productsStore = new Store(
	{
		name: 'products',
		cwd: path.join(__dirname, '..', '..', 'data'),
	},
	{
		list: [],
	},
)

const menusStore = new Store({
	name: 'menu',
	cwd: path.join(__dirname, '..', '..', 'data'),
})

const store = {
	products: productsStore,
	menu: menusStore,
}

type StoreKey = keyof typeof store

export const getFromStore = (storeName: StoreKey, key: string) => {
	if (!store[storeName]) return null
	return store[storeName].get(key)
}

export const setToStore = (storeName: StoreKey, key: string, data: any) => {
	if (!store[storeName]) return null
	return store[storeName].set(key, data)
}
