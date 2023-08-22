import moment from 'moment'
import 'moment/locale/uk'

moment.locale('uk')

export const prepareDateForDatePicker = (date: any) => {
	if (!date) return null
	return moment(new Date(date))
}

export const formatDate = (date: any, format: string) => {
	return moment(new Date(date)).format(format)
}

export const dateToYMstring = (date: any) => {
	const _date = new Date(date)
	return `${_date.getFullYear()}/${_date.getMonth()}`
}

export const YMstringToDate = (str: string) => {
	const year = str.split('/')[0]
	const month = str.split('/')[1]
	const date = new Date()
	date.setFullYear(Number(year))
	date.setMonth(Number(month))

	return date
}
