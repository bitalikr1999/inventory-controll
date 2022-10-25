import { RouteKey } from '@/@types/enums'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ChildrensListPage } from '../childrens/pages'
import { GroupPage } from '../childrens/pages/group'
import { MenuListPage } from '../menu/pages'
import { MenuEditorPage } from '../menu/pages/editor'
import { ProductsListPage } from '../products/pages/list'
import { WarehouseAdmissionPage } from '../warehouse/pages'
import { WarehouseListPage } from '../warehouse/pages/list'
import { ZdoEditorPage } from '../zdo/pages'
import { ZdoListPage } from '../zdo/pages/list'
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
						path={RouteKey.Warehouse}
						element={<WarehouseListPage />}
					/>
					<Route
						path={RouteKey.WarehouseAdmission}
						element={<WarehouseAdmissionPage />}
					/>

					{/* <Route path={RouteKey.ZDO} element={<ZdoListPage />} /> */}
					<Route path={RouteKey.ZDO} element={<ZdoEditorPage />} />
					<Route
						path={RouteKey.MenuEditor}
						element={<MenuEditorPage />}
					/>
				</Routes>
			</MainLayout>
		</HashRouter>
	)
}
