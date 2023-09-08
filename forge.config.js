const path = require('path')

module.exports = {
	hooks: {
		// postPackage: require('./scripts/notarize.js'),
	},
	packagerConfig: {
		appBundleId: 'app.silo.com',
		name: 'Silo',
		executableName: 'Silo',
		icon: 'assets/icon',
		// osxSign: {
		// 	identity:
		// 		'Developer ID Application: JetUp Digital, TOV (7LY53JU2YB)',
		// 	'hardened-runtime': false,
		// 	'gatekeeper-assess': false,
		// 	entitlements: 'src/default.mas.plist',
		// 	version: '1.0.0',
		// },
		// osxNotarize: {
		// 	tool: 'notarytool',
		// 	appleApiKey: path.join(
		// 		__dirname,
		// 		'scripts',
		// 		'AuthKey_P9Z59QAD2M.p8',
		// 	),
		// 	appleApiKeyId: 'P9Z59QAD2M',
		// 	appleApiIssuer: 'b5ddf310-835b-484a-985d-f70ab1ebea26',
		// },
	},
	plugins: [
		[
			'@electron-forge/plugin-webpack',
			{
				mainConfig: './webpack/main.webpack.js',
				renderer: {
					config: './webpack/renderer.webpack.js',
					entryPoints: [
						{
							html: './public/index.html',
							js: './src/index.tsx',
							description: 'My Description',
							name: 'main_window',
							preload: {
								js: './electron/bridge.ts',
							},
						},
					],
				},
			},
		],
	],
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'Warehouse',
				description: 'My Description',
			},
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin', 'linux', 'windows'],
		},
		{
			name: '@electron-forge/maker-deb',
			config: {},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {},
		},
		{
			name: '@electron-forge/maker-dmg',
			config: {
				background: './assets/bg.webp',
				format: 'ULFO',
			},
		},
	],
}
