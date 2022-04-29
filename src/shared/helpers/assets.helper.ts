import { GroupCategoryKey } from '@/@types/enums'
import child from '@/assets/child.png'
import child2 from '@/assets/child2.png'
import senior from '@/assets/senior.png'
import _ from 'lodash'

const ims = {
	[GroupCategoryKey.Junior]: child,
	[GroupCategoryKey.Middle]: child2,
	[GroupCategoryKey.Senior]: senior,
}

export const getGroupCategoryImg = (category: GroupCategoryKey) => {
	return ims[_.defaultTo(category, GroupCategoryKey.Junior)]
}
