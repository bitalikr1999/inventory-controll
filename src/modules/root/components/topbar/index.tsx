import { RouteKey } from '@/@types/enums'
import {
	AppstoreOutlined,
	CoffeeOutlined,
	LockOutlined,
	MehOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import './style.css'

export const TopBar = () => {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<div className="topbar">
			<Menu
				mode="horizontal"
				selectedKeys={location.pathname.split('/')}
				className="topbar-menu">
				<Menu.Item
					key={RouteKey.Menu.split('/')[1]}
					icon={<AppstoreOutlined />}
					onClick={() => navigate(RouteKey.Menu)}>
					Меню
				</Menu.Item>
				<Menu.Item
					key={RouteKey.Warehouse.split('/')[1]}
					icon={<LockOutlined />}
					onClick={() => navigate(RouteKey.Warehouse)}>
					Склад
				</Menu.Item>
				<Menu.Item
					key={RouteKey.Children.split('/')[1]}
					icon={<MehOutlined />}
					onClick={() => navigate(RouteKey.Children)}>
					Діти
				</Menu.Item>
				<Menu.Item
					key={RouteKey.Products.split('/')[1]}
					icon={<CoffeeOutlined />}
					onClick={() => navigate(RouteKey.Products)}>
					Продукти
				</Menu.Item>
			</Menu>
			<div className="right">
				<button
					className="ofbutton"
					onClick={() => navigate(RouteKey.Settings)}>
					<SettingOutlined />
				</button>
			</div>
		</div>
	)
}
