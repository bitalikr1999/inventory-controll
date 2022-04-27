import { RouteKey } from '@/@types/enums'
import { LogoutOutlined, MailOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import './style.css'

export const TopBar = () => {
	const navigate = useNavigate()
	const location = useLocation()
	console.log(location)

	return (
		<div className="topbar">
			<Menu
				mode="horizontal"
				selectedKeys={location.pathname.split('/')}
				className="topbar-menu">
				<Menu.Item
					key={RouteKey.Menu.split('/')[1]}
					icon={<MailOutlined />}
					onClick={() => navigate(RouteKey.Menu)}>
					Меню
				</Menu.Item>
				<Menu.Item
					key={RouteKey.Products.split('/')[1]}
					icon={<MailOutlined />}
					onClick={() => navigate(RouteKey.Products)}>
					Продукти
				</Menu.Item>
				<Menu.Item
					key={RouteKey.ZDO.split('/')[1]}
					icon={<MailOutlined />}
					onClick={() => navigate(RouteKey.ZDO)}>
					ЗДО
				</Menu.Item>
				<Menu.Item
					key={RouteKey.ReportCard.split('/')[1]}
					icon={<MailOutlined />}
					onClick={() => navigate(RouteKey.ReportCard)}>
					Табелі
				</Menu.Item>
				<Menu.Item
					key={RouteKey.Children.split('/')[1]}
					icon={<MailOutlined />}
					onClick={() => navigate(RouteKey.Children)}>
					Діти
				</Menu.Item>
			</Menu>
			<div className="right">
				<button className="ofbutton">
					<LogoutOutlined />
				</button>
			</div>
		</div>
	)
}