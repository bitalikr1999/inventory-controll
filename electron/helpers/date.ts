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
