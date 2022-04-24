const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
	// target: 'node',
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		fallback: {
			fs: false,
			tls: false,
			net: false,
			path: false,
			zlib: false,
			http: false,
			https: false,
			stream: false,
			crypto: false,
			os: false,
		},
	},
	module: {
		rules: require('./rules.webpack'),
	},
	plugins: [new NodePolyfillPlugin()],
}
