const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    port: 3000, // 服务器启动端口
    progress: true, // 启动服务器产生进度条
    contentBase: './dist', // 以该目录作为服务器基础目录
    compress:true, // 启动zip压缩
    open: true // 启动服务自动打开浏览器
  },
  // mode: 'development',
  mode: 'production', // 打包模式
  entry: './src/index.js', // 入口文件
  output: { // 出口文件
    filename: 'bundle.[hash:8].js', // 使用hash文件有更改时，每次打包产生不同的文件
    path: path.resolve(__dirname, 'dist') // 打包后文件保存路径
  },

  plugins: [
    new HtmlWebpackPlugin({ // js入口文件导入模板文件并打包生成新的文件
      template: './src/index.html',  //模板文件路径
      filename: 'index.html', // 打包模板文件名称
      minify: { // 未设置时候，html代码是压缩为一行，但一些其他的未压缩
        removeAttributeQuotes: true, // 去除标签属性双引号
        collapseWhitespace: true, // 设置minify需要设置将其压缩为一行
      },
      hash: true, // 打包模板后添加hash戳，缓存问题
    })
  ],
}

