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
    // new webpack.ProvidePlugin({ // 在每个模块中注入 $
    //   $: 'jquery',
    // })
  ],

  externals: {
    jquery: '$'
  },

  module: {
    rules: [
      // {
      //   test: require.resolve('jquery'),
      //   loader: 'expose-loader',
      //   options: {
      //     exposes: ['$', 'jQuery'],
      //   },
      // },
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: 'eslint-loader',
      //     options: {
      //       enforce: 'pre' // previous post[normal之后执行]
      //     }
      //   }
      // },
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