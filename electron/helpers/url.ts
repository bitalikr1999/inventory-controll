export const getFileNameFromUrl = (url: string) => {
	return url.substring(url.lastIndexOf('/') + 1)
}
