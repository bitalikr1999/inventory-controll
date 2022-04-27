import { IMenu } from '@/@types/interfaces'
import { createStyleSheet } from '@/shared/helpers'
import moment from 'moment'
import { FC, useMemo } from 'react'
import 'moment/locale/uk'

interface MenuItemProps {
	menu: IMenu
}

moment.locale('uk')

export const MenuItem: FC<MenuItemProps> = ({ menu }) => {
	const title = useMemo(() => {
		const date = new Date(menu.date)
		return moment(date).format('D MMMM')
	}, [menu])

	return (
		<div style={styles.container}>
			<p style={styles.title}>{title}</p>
		</div>
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
