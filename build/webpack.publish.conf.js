var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env = config.publish.env

var webpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: './example/src/index.js'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.publish.productionSourceMap,
      extract: true
    })
  },
  devtool: config.publish.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.publish.assetsRoot,
    publicPath: config.publish.assetsPublicPath,
    filename: 'vue-simple-cropper.js',
    library: 'VueSimpleCropper',
    libraryTarget: 'umd'
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      // filename: utils.assetsPath('css/[name].[contenthash].css')
      filename: 'style.css'
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin()
  ]
})

module.exports = webpackConfig
