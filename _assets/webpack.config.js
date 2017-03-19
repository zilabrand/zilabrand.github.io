/* eslint-env node */

const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	context: path.resolve(__dirname, './src'),
	entry: {
		app: './index.js',
	},
	output: {
		path: path.resolve(__dirname, '../'),
		filename: '_script.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['es2015'],
						ignore: /node_modules/,
					},
				}],
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'postcss-loader', 'sass-loader',],
				})
			},
		],
	},
	plugins: [
		new ExtractTextPlugin('_style.css')
	],
	// Need this for some bug nonsense
	node: {
		fs: 'empty',
	},
}
