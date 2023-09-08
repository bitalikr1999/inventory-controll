import { Controller } from 'electron/abstract'
import { ProductsSummaryXlsx } from 'electron/core/products/products-summary-xlsx'
import { productsRepository } from 'electron/repositories'
import {
	GenerateZdosXlsxParams,
	IAddProductPayload,
	IUpdateProductPayload,
} from 'electron/typing'

export class ProductsController extends Controller {
	protected basePath = 'products'
	protected routes = {
		generateSummary: this.generateSummary,
		add: this.add,
		update: this.update,
		getAll: this.getAll,
		delete: this.delete,
	}

	protected generateSummary(_event: unknown, params: GenerateZdosXlsxParams) {
		new ProductsSummaryXlsx().generate(params)
	}

	protected async getAll() {
		return productsRepository.find({})
	}

	protected async add(_event: unknown, payload: IAddProductPayload) {
		productsRepository.insert(payload)
	}

	protected async update(_: unknown, payload: IUpdateProductPayload) {
		const exist = await productsRepository.findOne({ _id: payload._id })
		if (!exist) return

		await productsRepository.updateOne({ _id: payload._id }, payload)
	}

	protected async delete(_: unknown, _id: string) {
		await productsRepository.remove(_id)
	}
}
