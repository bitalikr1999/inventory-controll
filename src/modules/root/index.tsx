import { RouteKey } from '@/@types/enums'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ChildrensListPage } from '../childrens/pages'
import { GroupPage } from '../childrens/pages/group'
import { MenuListPage } from '../menu/pages'
import { MenuEditorPage } from '../menu/pages/editor'
import { ProductsListPage } from '../products/pages/list'
import { MainLayout } from './components'

export const Root = () => {
	return (
		<HashRouter>
			<MainLayout>
				<Routes>
					<Route path="/" element={<Navigate to={RouteKey.Menu} />} />
					<Route
						path={RouteKey.Products}
						element={<ProductsListPage />}
					/>
					<Route
						path={RouteKey.Children}
						element={<ChildrensListPage />}
					/>
					<Route path={RouteKey.Menu} element={<MenuListPage />} />
					<Route path={RouteKey.Group} element={<GroupPage />} />
					<Route
						path={RouteKey.MenuEditor}
						element={<MenuEditorPage />}
					/>
				</Routes>
			</MainLayout>
		</HashRouter>
	)
}
