module.exports = {
  plugins: [
    // 集合package.json中的browserlist配置给css样式添加浏览器兼容前缀
    require('autoprefixer')
  ]
}