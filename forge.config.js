module.exports = {
	hooks: {
		postPackage: async (forgeConfig, options) => {
			if (options.spinner) {
				options.spinner.info(
					`Completed packaging for ${options.platform} / ${options.arch} at ${options.outputPaths[0]}`,
				)
			}
		},
	},
	packagerConfig: {
		name: 'Warehouse',
		executableName: 'Warehouse',
		icon: 'assets/icon',
		arch: ['x64', 'arm64'],
		platforms: ['darwin'],
		osxSign: {
			optionsForFile: filePath => {
				// Here, we keep it simple and return a single entitlements.plist file.
				// You can use this callback to map different sets of entitlements
				// to specific files in your packaged app.
				console.log('filepath', filePath)
				return {
					entitlements: './default.mas.plist',
				}
			},
		},
		// osxNotarize: {
		// 	tool: 'notarytool',
		// 	appleId: 'bitalikrty@gmail.com',
		// 	appleIdPassword: 'irfc-nqaf-pxda-mwtm',
		// 	teamId: '7LY53JU2YB',
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
