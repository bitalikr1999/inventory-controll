import { FC, useEffect } from 'react'
import { TopBar } from '../topbar'
import './style.css'

let db = { preventDb: '' }

export const MainLayout: FC = ({ children }) => {
	useEffect(() => {
		window.addEventListener('keypress', e => {
			if (db.preventDb === 'q' && 'w' === e.key) {
				window.Main.emit('openDevTooles', {})
				db.preventDb = null
			} else {
				db.preventDb = e.key
			}
		})
	}, [])

	return (
		<div>
			<TopBar />

			<div className="content">{children}</div>
		</div>
	)
}
