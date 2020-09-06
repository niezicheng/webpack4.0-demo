const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
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
    })
  ],

  module: {
    rules: [
      // css-loader 主要解析@import这种语法
      // style-loader 将css插入到head标签中去
      // loader 特点，希望单一
      // loader 用法：单个使用字符串，多个可以使用数组，可以写成一个对象，添加options参数
      // loader 顺序： 从右向左，从下往上
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'head'
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'head'
            }
          },
          'css-loader', // @import 解析路径
          'less-loader' // 把 less -> css
        ]
      }
    ]
  }
}