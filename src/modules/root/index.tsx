import { RouteKey } from '@/@types/enums'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ChildrensListPage } from '../childrens/pages'
import { GroupPage } from '../childrens/pages/group'
import { MenuListPage } from '../menu/pages'
import { ProductsListPage } from '../products/pages/list'
import { MainLayout } from './components'

export const Root = () => {
	return (
		<HashRouter>
			<MainLayout>
				<Routes>
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
				</Routes>
			</MainLayout>
		</HashRouter>
	)
}
