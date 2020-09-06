const path = require('path');
// 模板文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 提出单独的css样式文件，并以link的方式插入到head中
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩单独提出的css文件，只用于production模式【但原本压缩的js出口文件又不会压缩了，结合terser-webpack-plugin插件使用使JS压缩】
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 结合OptimizeCSSAssetsPlugin使用production下压缩出口js文件
const TerserWebpackPlugin = require('terser-webpack-plugin');


module.exports = {
  optimization: {// 优化项配置【production下才会生效】
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new TerserWebpackPlugin()
    ]
  },
  // mode: 'development',
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
      hash: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
    })
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  }
}