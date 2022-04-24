import _ from 'lodash'

export const prepareValidatorResult = (result: any) => {
	if (_.isEmpty(result)) return null

	_.each(result, (it, key, arr) => {
		arr[key] = it[0]
	})

	return result
}
