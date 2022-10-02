import moment from 'moment'

export const prepareDateForDatePicker = (date: any) => {
	if (!date) return null
	return moment(new Date(date))
}
