import { FC } from 'react'
import { TopBar } from '../topbar'
import './style.css'


export const MainLayout: FC = ({ children }) => {
    return (
       <div>
           <TopBar />
           
           <div className="content">{children}</div>
        </div>
    )
}