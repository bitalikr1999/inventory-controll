export const formartNumber = (number: number) => {
	return number.toFixed(2)
}
export const getSumm = (price: number, count: number) => {
	return Number(formartNumber(Number(price) * Number(count)))
}
