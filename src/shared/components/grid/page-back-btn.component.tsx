import { createStyleSheet } from '@/shared/helpers'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export const PageBackBtn = () => {
	const navigate = useNavigate()
	return (
		<Button
			type="primary"
			onClick={() => navigate(-1)}
			shape="circle"
			icon={<ArrowLeftOutlined />}
			style={style.button}
		/>
	)
}

const style = createStyleSheet({
	button: {
		position: 'fixed',
		bottom: 15,
		left: 15,
	},
})
