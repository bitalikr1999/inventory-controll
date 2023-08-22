import { API } from '@/shared/core'
import { GenerateZdosXlsxParams } from 'electron/typing'

class ProductsAPI extends API {
	protected basePath = 'products'

	public generateSummary(params: GenerateZdosXlsxParams) {
		return this.call('generateSummary', params)
	}
}

export const productsAPI = new ProductsAPI()
