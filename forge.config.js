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
}
