import { Events } from '../tools/events'

export type AppEvents = {
	onChangeStoreData: {
		key: string
		data: any
	}
}

export const appEvents = new Events<AppEvents>()
