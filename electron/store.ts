import path from 'path'
import { dbCwd } from './config'
const Store = require('electron-store')

const productsStore = new Store(
	{
		name: 'products',
		cwd: path.join(dbCwd, ''),
	},
	{
		list: [],
	},
)

const store = {
	products: productsStore,
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
