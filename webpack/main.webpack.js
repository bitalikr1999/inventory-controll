const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
	resolve: {
		extensions: ['.ts', '.js'],
	},
	entry: './electron/main.ts',
	module: {
		rules: require('./rules.webpack'),
	},
	plugins: [new NodePolyfillPlugin()],
}
