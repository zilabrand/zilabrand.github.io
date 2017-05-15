/* eslint-env node */

const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: 'index.ts',
  },
  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, 'src'),
    ],
    extensions: ['.ts', '.js', 'scss'],
  },
  output: {
    path: path.resolve(__dirname, '../_site/'),
    filename: '_script.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'awesome-typescript-loader',
        }
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
  // node: {
    // fs: 'empty',
  // },
}
