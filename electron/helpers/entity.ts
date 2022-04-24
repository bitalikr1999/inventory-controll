import _ from 'lodash'

export const getId = <T extends { id: number }>(entities: T[]) => {
	if (_.isEmpty(entities)) return 0
	return Number(entities[entities.length - 1].id) + 1
}
