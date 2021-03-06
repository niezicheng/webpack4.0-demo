const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new TerserWebpackPlugin()
    ]
  },
  mode: 'development',
  // mode: 'production',
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
    }),
  ],

  externals: {
    jquery: '$'
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        // 使用 file-loader 对于小图片也会进行 http 请求资源
        // 使用 url-loader 限制图片大小小于多少使用 base4 进行转化， 大于使用 file-loader 请求加载
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024 * 10, // 10k以内的图片转Base64打包到js中
            name: '[name].[hash:7].[ext]', // 打包的文件名
            outputPath: 'images/',
            esModule: false
          }
        }]
      },
      {
        test: /\.js/, // normal 普通的loader
        use: {
          loader: 'babel-loader',
          options: { // 用babel-loader，将es6 -> es5，也可以将该设置在.babelrc文件中设置
            presets: [ // 预设
              '@babel/preset-env'
            ],
            plugins: [
              // loader中的小插件，转换更高级的es语法，如class类
              // '@babel/plugin-proposal-class-properties'

              // js高级语法 装饰器插件【实验阶段，但可以支持】
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              ["@babel/plugin-proposal-class-properties", { "loose" : true }],
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include: path.resolve(__dirname, 'src'), // 查找解析src下面的js文件
        exclude: /node_module/ // 排除查找匹配node_module下的js文件
      },
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