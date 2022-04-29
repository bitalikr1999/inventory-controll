import { IMenu } from '@/@types/interfaces'
import { createStyleSheet, getGroupCategoryImg } from '@/shared/helpers'
import moment from 'moment'
import { FC, useMemo } from 'react'
import 'moment/locale/uk'
import { Avatar, Card } from 'antd'
import Meta from 'antd/lib/card/Meta'
import {
	DeleteOutlined,
	EditOutlined,
	FullscreenOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import { GroupCategoryKey } from '@/@types/enums'
import { groupCategoryLabels } from '@/modules/childrens/config'

interface MenuItemProps {
	menu: IMenu
	onPressItem: () => void
	onPressDelete: () => void
}

moment.locale('uk')

export const MenuItem: FC<MenuItemProps> = ({
	menu,
	onPressItem,
	onPressDelete,
}) => {
	const title = useMemo(() => {
		const date = new Date(menu.date)
		return moment(date).format('D MMMM')
	}, [menu])

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

const styles = createStyleSheet({
	container: {
		border: '1px solid rgba(0,0,0.1)',
		borderRadius: 8,
		padding: 15,
		textAlign: 'center',
	},
	title: {
		fontSize: 18,
		margin: 0,
	},
})
