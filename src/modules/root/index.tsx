import { RouteKey } from '@/@types/enums'
import { createStyleSheet } from '@/shared/helpers'
import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ChildrensListPage } from '../childrens/pages'
import { GroupCalendar } from '../childrens/pages/calendar'
import { GroupPage } from '../childrens/pages/group'
import { MenuListPage } from '../menu/pages'
import { MenuEditorPage } from '../menu/pages/editor'
import { ProductsListPage } from '../products/pages/list'
import { WarehouseAdmissionPage } from '../warehouse/pages'
import { WarehouseListPage } from '../warehouse/pages/list'
import { ZdoEditorPage } from '../zdo/pages'
import { MainLayout } from './components'
import { ProductsCategoriesPage } from '../warehouse/pages/categories'
import { SettingsPage } from '../settings/pages/settings.page'

export const Root = () => {
	const [isLoading, setLoading] = useState(true)

	useEffect(() => {
		setTimeout(() => {
			setLoading(false)
		}, 1000)
	}, [])

	return (
		<>
			{isLoading ? (
				<div style={styles.overlay}>
					<div className="lds-dual-ring"></div>
					<p style={{ marginTop: 20 }}>Завантаження</p>
				</div>
			) : null}
			<HashRouter>
				<MainLayout>
					<Routes>
						<Route
							path="/"
							element={<Navigate to={RouteKey.Menu} />}
						/>
						<Route
							path={RouteKey.Products}
							element={<ProductsListPage />}
						/>
						<Route
							path={RouteKey.Children}
							element={<ChildrensListPage />}
						/>
						<Route
							path={RouteKey.Menu}
							element={<MenuListPage />}
						/>
						<Route path={RouteKey.Group} element={<GroupPage />} />
						<Route
							path={RouteKey.Warehouse}
							element={<WarehouseListPage />}
						/>
						<Route
							path={RouteKey.WarehouseAdmission}
							element={<WarehouseAdmissionPage />}
						/>

						<Route
							path={RouteKey.ZDO}
							element={<ZdoEditorPage />}
						/>
						<Route
							path={RouteKey.MenuEditor}
							element={<MenuEditorPage />}
						/>

						<Route
							path={RouteKey.GroupCalendar}
							element={<GroupCalendar />}
						/>

						<Route
							path={RouteKey.WarehouseCategories}
							element={<ProductsCategoriesPage />}
						/>

						<Route
							path={RouteKey.Settings}
							element={<SettingsPage />}
						/>
					</Routes>
				</MainLayout>
			</HashRouter>
		</>
	)
}

const styles = createStyleSheet({
	overlay: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		height: '100%',
		width: '100%',
		backgroundColor: '#fff',
		zIndex: 999999,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
	},
})
