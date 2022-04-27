import ReactDOM from 'react-dom'
import './shared/styles/reset.css'
import 'antd/dist/antd.css'
import { Root } from './modules/root'

window.Main.on('message', message => {
	console.log('Alert', message)
})

ReactDOM.render(<Root />, document.getElementById('root'))
