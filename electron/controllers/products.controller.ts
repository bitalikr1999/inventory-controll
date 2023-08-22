import { Controller } from 'electron/abstract'
import { ProductsSummaryXlsx } from 'electron/core/products/products-summary-xlsx'
import { GenerateZdosXlsxParams } from 'electron/typing'

export class ProductsController extends Controller {
	protected basePath = 'products'
	protected routes = {
		generateSummary: this.generateSummary,
	}

	protected generateSummary(_event: unknown, params: GenerateZdosXlsxParams) {
		new ProductsSummaryXlsx().generate(params)
	}
}
