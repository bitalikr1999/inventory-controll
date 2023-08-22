import { FC, useMemo } from 'react'
import { Avatar, Card } from 'antd'
import Meta from 'antd/lib/card/Meta'

import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { IMenu } from '@/@types/interfaces'
import { formatDate, getGroupCategoryImg } from '@/shared/helpers'
import { groupCategoryLabels } from '@/modules/childrens/config'

interface MenuItemProps {
	menu: IMenu
	onPressItem: () => void
	onPressDelete: () => void
}

export const MenuItem: FC<MenuItemProps> = ({
	menu,
	onPressItem,
	onPressDelete,
}) => {
	const title = useMemo(() => formatDate(menu.date, 'D MMMM'), [menu?.date])

	return (
		<Card
			actions={[
				<DeleteOutlined onClick={() => onPressDelete()} />,
				<EditOutlined
					key="edit"
					title="Редагувати"
					onClick={onPressItem}
				/>,
			]}>
			<Meta
				avatar={
					<Avatar
						size="large"
						src={getGroupCategoryImg(menu.groupCategory)}
					/>
				}
				title={title}
				description={`
                    Категорія: ${groupCategoryLabels[menu.groupCategory]} 
                `}
			/>
		</Card>
	)
}
