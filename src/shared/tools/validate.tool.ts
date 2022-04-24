import _ from 'lodash'
import moment from 'moment'
import _validate from 'validate.js'
import { prepareValidatorResult } from '../helpers/validator.helper'

_validate.extend(_validate.validators.datetime, {
	parse: function (value: any, options: any) {
		console.log('parse', value, +moment.utc(value))
		return +moment.utc(value)
	},
	format: function (value: any, options: any) {
		var format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss'
		console.log('format', value, moment.utc(value).format(format))
		return moment.utc(value).format(format)
	},
})

const presenceCost = {
	allowEmpty: false,
	message: '^Поле обовязкове',
}

const validate = (values: any, constraints: any) => {
	const result = _validate(values, constraints)
	return prepareValidatorResult(result)
}

_validate.validators.array = (
	arrayItems: any[],
	options: { length: number; message: string; key?: string },
) => {
	if (_.isEmpty(arrayItems)) return presenceCost.message
	if (arrayItems.length < options.length) return options.message

	if (options.key) {
		if (!arrayItems[0][options.key]) return options.message
	}

	return null
}

export { validate, presenceCost }
