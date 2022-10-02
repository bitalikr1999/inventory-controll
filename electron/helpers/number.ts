export const NumberToXlsxChar = (number: number) => {
	var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	var result = ''
	function printToLetter(number: number) {
		var charIndex = number % alphabet.length
		var quotient = number / alphabet.length
		if (charIndex - 1 == -1) {
			charIndex = alphabet.length
			quotient--
		}
		result = alphabet.charAt(charIndex - 1) + result
		if (quotient >= 1) {
			printToLetter(parseInt(quotient as any))
		} else {
			console.log(result)
			result = ''
		}
	}
	printToLetter(number)

	return result
}
