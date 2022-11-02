import { AddMenuPayload, IMenu } from 'electron/typing'

export const getMenuDifference = (oldMenu: IMenu, newMenu: AddMenuPayload) => {
	try {
		const warehouseToReturn: any[] = []
		const warehouseToSubstract: any[] = []

		console.log('oldmenu', oldMenu)
		console.log('newmenu', newMenu)

		newMenu.items.map(item => {
			const oldItem = oldMenu?.items?.find(it => it.id === item.id)

			if (!oldItem)
				warehouseToSubstract.push(
					...item.products.map(it => {
						return {
							warehouseId: it.product.warehouseId,
							count: it.count,
						}
					}),
				)

			item.products.map(productItem => {
				const oldWarehouseItem = oldItem?.products?.find(
					it =>
						it.product.warehouseId ===
						productItem.product.warehouseId,
				)
				if (!oldWarehouseItem)
					warehouseToSubstract.push({
						warehouseId: productItem.product.warehouseId,
						count: productItem.count,
					})
				else {
					if (
						Number(productItem.count) >
						Number(oldWarehouseItem.count)
					) {
						warehouseToSubstract.push({
							warehouseId: productItem.product.warehouseId,
							count:
								Number(productItem.count) -
								Number(oldWarehouseItem.count),
						})
					} else {
						const count =
							Number(oldWarehouseItem.count) -
							Number(productItem.count)

						if (count)
							warehouseToReturn.push({
								warehouseId: productItem.product.warehouseId,
								count,
							})
					}
				}
			})
			if (!oldItem) return

			oldItem.products.map(oldProduct => {
				const newProduct = item.products.find(
					it =>
						it.product.warehouseId ===
						oldProduct.product.warehouseId,
				)
				if (!newProduct) {
					warehouseToReturn.push({
						warehouseId: oldProduct.product.warehouseId,
						count: oldProduct.count,
					})
				}
			})
		})

		console.log('warehouseToSubstract', warehouseToSubstract)
		console.log('warehouseToReturn', warehouseToReturn)

		return {
			warehouseToSubstract,
			warehouseToReturn,
		}
	} catch (e) {
		console.log(e)
	}
}
