import { useLocation } from 'react-router-dom'

type DataExtractor<T> = (state: any) => T

const defaultExtractor: DataExtractor<any> = (state: any) => state

export const useLocationState = <T = any>(
	extractor: DataExtractor<T> = defaultExtractor,
): [T, any] => {
	const location: any = useLocation()

	return [extractor(location.state), location.state]
}
