import { API } from '@/shared/core'
import {
	GenerateZdosXlsxParams,
	IAddProductPayload,
	IUpdateProductPayload,
} from 'electron/typing'

class ProductsAPI extends API {
	protected basePath = 'products'

	public generateSummary(params: GenerateZdosXlsxParams) {
		return this.call('generateSummary', params)
	}

	public getAll() {
		return this.call('getAll', {})
	}

	public add(payload: IAddProductPayload) {
		return this.call('add', payload)
	}

	public update(payload: IUpdateProductPayload) {
		return this.call('update', payload)
	}

	public delete(id: string) {
		return this.call('delete', id)
	}
}

export const productsAPI = new ProductsAPI()
