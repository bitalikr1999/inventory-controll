import { presenceCost, validate } from '@/shared/tools'

const constraints = {
	name: {
		presence: presenceCost,
	},
	price: {
		presence: presenceCost,
	},
	measurmentUnit: {
		presence: presenceCost,
	},
}

export const validateProduct = <T>(data: T) => {
	return validate(data, constraints)
}
