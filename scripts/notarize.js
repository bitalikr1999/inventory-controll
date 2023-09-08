const { notarize } = require('electron-notarize')
const path = require('path')

const buildOutput = require('path').resolve(
	__dirname,
	'..',
	'out',
	'Silo-darwin-arm64',
	'Silo.app',
)

console.log('buildOutput', buildOutput)
console.log('key', path.join(__dirname, 'AuthKey_P9Z59QAD2M.p8'))
module.exports = async function notarizing() {
	if (process.platform !== 'darwin') {
		console.log('Not a Mac; skipping notarization')
		return
	}

	return await notarize({
		tool: 'notarytool',
		appleApiKey: path.join(__dirname, 'AuthKey_P9Z59QAD2M.p8'),
		appleApiKeyId: 'P9Z59QAD2M',
		appleApiIssuer: 'b5ddf310-835b-484a-985d-f70ab1ebea26',
		appBundleId: 'app.silo.com',
		appPath: buildOutput,
		// appleId: process.env.APPLEID,
		// appleIdPassword: process.env.APPLEIDPASS,
	})
}
