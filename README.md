### webpack4基本配置信息

#### 入口 entry

```js
entry: './src/index.js'
```



#### 出口 output

```js
output: {
    filename: 'bundle.[hash:8].js', // 使用hash文件有更改时，每次打包产生不同的文件
    path: path.resolve(__dirname, 'dist') // 打包后文件保存路径
},
```



#### 环境配置 mode

```js
// 打包模式，环境配置
mode: 'production', // 生产环境
// mode: 'development', // 开发环境
```



#### 模块 loader

##### babel-loader

```js
 // 打包后对匹配的js文件语法转换及提供语法支持
            {
                test: /\.js/,
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
                            // 1、配置es6 -> es5 或者更高级的语法时均会使用到 development
                            // 2、多个js文件中使用class类并打包后，将相同校验类_classCallCheck抽离为公共方法
                            // 3、会为输出代码注入一些脚本，需要安装@babel/runting补丁，上线【production】的时候也需要
                            "@babel/plugin-transform-runtime" // 代码运行时的包
                        ]
                    }
                },
                include: path.resolve(__dirname, 'src'), // 查找解析src下面的js文件
                exclude: /node_module/ // 排除查找匹配node_module下的js文件
            },
```



###### @babel/polyfill

**js一些高级语法的支持**

如：Es7中的includes() 方法

```shell
yarn add @babel/polyfill
```

需要使用高级js语法文件中引入：

```js
import '@babel/polyfill';

// 引入@babel/polyfill打包后会帮我们自动在原型上添加实现该方法，如果没有引入打包后js文件中该方法原样输出
'str'.includes();
```




##### eslint-loader

```js
// 对js文件使用eslint进行语法校验
{
    test: /\.js$/,
        use: {
            loader: 'eslint-loader', // 在对应的eslint官网下载对应的.eslintrc.json文件
                options: {
                    enforce: 'pre' // 默认为 normal, pre在normal前执行, post 在normal后执行
                }
        }
}
```

###### .eslintrc.json 文件

官网配置下载



##### css-loader、less-loader

```js
// css-loader 主要解析@import这种语法
// style-loader 将css插入到head标签中去
// loader 特点，希望单一
// loader 用法：单个使用字符串，多个可以使用数组，可以写成一个对象，添加options参数
// loader 顺序： 从右向左，从下往上
// style-loader: 在main.js内提供了一个能将css动态插入到head中
{
    test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader', // css-loader：将导入项目的css变为js模块，打包到main.js内
            'postcss-loader'
        ]
},
{
    test: /\.less$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader', // 可以结合postcss.config.js文件中配置的autoprefixer插件为浏览器添加兼容前缀
            'less-loader'
        ]
}

```

###### postcss-loader

postcss.config.js

```js
module.exports = {
  plugins: [
    // 集合package.json中的browserlist配置给css样式添加浏览器兼容前缀
    require('autoprefixer')
  ]
}
```

package.json

```js
// 	使用postcss-loader中的autoprefixer插件添加浏览器前缀需要配置
"browserslist": [
    "last 10 versions",
    ">1%",
    "ios 7"
]
```



##### expose-loader

```js
/** js文件中 **/
export $ from 'jquery'
console.log(window.$); // jQuery
console.log($); // jQuery

// 暴露第三方模块到全局对象中
{
  test: require.resolve('jquery'),
  loader: 'expose-loader',
  options: {
    exposes: ['$', 'jQuery'],
  },
},
```





#### 插件 plugins

##### html-webpack-plugin 模板文件

```js
// 模板文件
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
    	// js入口文件导入模板文件并打包生成新的文件
        new HtmlWebpackPlugin({
            template: './src/index.html',  //模板文件路径
            filename: 'index.html', // 打包模板文件名称
            minify: { // 未设置时候，html代码是压缩为一行，但一些其他的未压缩
                removeAttributeQuotes: true, // 去除标签属性双引号
                collapseWhitespace: true, // 设置minify需要设置将其压缩为一行
            },
            hash: true, // 打包模板后添加hash戳，缓存问题
        }),
        
        // 从出口js文件中分离出单独的样式文件
        new MiniCssExtractPlugin({
            filename: 'main.css',  // 所有【单个】样式文件分离出来的css文件名称
        })
    ]
}
```



##### mini-css-extract-plugin 提取单独的 css 文件

```js
// 提出单独的css样式文件，并以link的方式插入到head中
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩单独提出的css文件，只用于production模式【但原本压缩的js出口文件又不会压缩了，结合terser-webpack-plugin插件使用使JS压缩】
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 结合OptimizeCSSAssetsPlugin使用production下压缩出口js文件
const TerserWebpackPlugin = require('terser-webpack-plugin');

// 优化项配置【production下才会生效】
optimization: {
    minimizer: [
        // 压缩由mini-css-extract-plugin分离出来的css文件
        new OptimizeCSSAssetsPlugin(), 
        // 压缩打包后的js文件
        new TerserWebpackPlugin() 
    ]
},

// 插件 Plugins
plugins: [
        // 从出口js文件中分离出单独的样式文件
        new MiniCssExtractPlugin({
            filename: 'main.css',  // 所有【单个】样式文件分离出来的css文件名称
        })
    ]
}
```

###### optimize-css-assets-webpack-plugin

###### terser-webpack-plugin 



##### webpack

###### ProvidePlugin

```js
const webpack = require('webpack');

plugins: [
    // 在每个模块中注入 $
    new webpack.ProvidePlugin({
        $: 'jquery',
    })
]
```



##### externals 不从 bundle 中引用依赖

```js
// 引入第三方库时，webpack build 时不进行打包
externals: {
    jquery: '$'
},
```





#### 完整的 webpack.config.js 文件

**webpack.config.js 或 webpackfile.js**

```js
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
    // 打包模式，环境配置
    mode: 'production',
    // mode: 'development',
    
    // 入口文件
    entry: './src/index.js', 
    
    // 出口文件
    output: {
        filename: 'bundle.[hash:8].js', // 使用hash文件有更改时，每次打包产生不同的文件
        path: path.resolve(__dirname, 'dist') // 打包后文件保存路径
    },
    
    // webpack自带的服务器配置
    devServer: {
        port: 3000, // 服务器启动端口
        progress: true, // 启动服务器产生进度条
        contentBase: './dist', // 以该目录作为服务器基础目录
        compress:true, // 启动zip压缩
        open: true // 启动服务自动打开浏览器
    },
    
    // 优化项配置【production下才会生效】
    optimization: {
        minimizer: [
            // 压缩由mini-css-extract-plugin分离出来的css文件
            new OptimizeCSSAssetsPlugin(), 
            // 压缩打包后的js文件
            new TerserWebpackPlugin() 
        ]
    },
    
    // loader
    module: {
        rules: [
            // 暴露第三方模块到全局对象中
            {
                test: require.resolve('jquery'),
                loader: 'expose-loader',
                options: {
                  exposes: ['$', 'jQuery'],
                },
              },
            // 对js文件使用eslint进行语法校验
            {
                test: /\.js$/,
                use: {
                    loader: 'eslint-loader', // 在对应的eslint官网下载对应的.eslintrc.json文件
                    options: {
                        enforce: 'pre' // 默认为 normal, pre在normal前执行, post 在normal后执行
                    }
                }
            }
            // 打包后对匹配的js文件语法转换及提供语法支持
            {
                test: /\.js/,
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
                            // 1、配置es6 -> es5 或者更高级的语法时均会使用到 development
                            // 2、多个js文件中使用class类并打包后，将相同校验类_classCallCheck抽离为公共方法
                            // 3、会为输出代码注入一些脚本，需要安装@babel/runting补丁，上线【production】的时候也需要
                            "@babel/plugin-transform-runtime" // 代码运行时的包
                        ]
                    }
                },
                include: path.resolve(__dirname, 'src'), // 查找解析src下面的js文件
                exclude: /node_module/ // 排除查找匹配node_module下的js文件
            },
            
            // css-loader 主要解析@import这种语法
            // style-loader 将css插入到head标签中去
            // loader 特点，希望单一
            // loader 用法：单个使用字符串，多个可以使用数组，可以写成一个对象，添加options参数
            // loader 顺序： 从右向左，从下往上
            // style-loader: 在main.js内提供了一个能将css动态插入到head中
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', // css-loader：将导入项目的css变为js模块，打包到main.js内
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader', // 可以结合postcss.config.js文件中配置的autoprefixer插件为浏览器添加兼容前缀
                    'less-loader'
                ]
            }
        ]
    }
    
    // 插件
    plugins: [
    	// js入口文件导入模板文件并打包生成新的文件
        new HtmlWebpackPlugin({
            template: './src/index.html',  //模板文件路径
            filename: 'index.html', // 打包模板文件名称
            minify: { // 未设置时候，html代码是压缩为一行，但一些其他的未压缩
                removeAttributeQuotes: true, // 去除标签属性双引号
                collapseWhitespace: true, // 设置minify需要设置将其压缩为一行
            },
            hash: true, // 打包模板后添加hash戳，缓存问题
        }),
        
        // 从出口js文件中分离出单独的样式文件
        new MiniCssExtractPlugin({
            filename: 'main.css',  // 所有【单个】样式文件分离出来的css文件名称
        }),
        
        // 在每个模块中注入 $
        new webpack.ProvidePlugin({
            $: 'jquery',
        })
    ],
    
    // 引入第三方库 jquery 时不打包
    externals: {
       	jquery: '$'
    },
}
```



#### package.json 文件

```json
{
  "name": "webpack",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack --config webpackfile.js"
  },
  "devDependencies": {
    "@babel/core": "^7.10.3",
    "@babel/plugin-proposal-class-properties": "^7.10.1",
    "@babel/plugin-proposal-decorators": "^7.10.3",
    "@babel/plugin-transform-runtime": "^7.10.3",
    "@babel/preset-env": "^7.10.3",
    "autoprefixer": "^9.8.2",
    "babel-loader": "^8.1.0",
    "css-loader": "^3.6.0",
    "eslint": "^7.8.1",
    "eslint-loader": "^4.0.2",
    "expose-loader": "^1.0.0",
    "html-webpack-plugin": "^4.3.0",
    "jquery": "^3.5.1",
    "less": "^3.11.3",
    "less-loader": "^6.1.2",
    "mini-css-extract-plugin": "^0.9.0",
    "optimize-css-assets-webpack-plugin": "^5.0.3",
    "postcss-loader": "^3.0.0",
    "style-loader": "^1.2.1",
    "terser-webpack-plugin": "^3.0.6",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.0"
  },
  "browserslist": [
    "last 10 versions",
    ">1%",
    "ios 7"
  ],
  "dependencies": {
    "@babel/polyfill": "^7.10.1",
    "@babel/runtime": "^7.10.3"
  }
}

```



#### QUESTION:

- 对修饰器的实验支持功能在将来的版本中可能更改。在 "tsconfig" 或 "jsconfig" 中设置 "experimentalDecorators" 选项以删除此警告。ts(1219)

  **jsconfig.json：**

  ```json
  {
    "compilerOptions": {
        "experimentalDecorators": true,
        "target": "es2017"
    },
    "exclude": [
        "node_modules",
        "dist"
    ],
    "include": [
        "src",
        "env",
        "static"
    ]
  }
  ```

- 引入第三方模块的方式

  ```js
  // 引入第三方模块的三种方式
      1、expose-loader 暴露到window
      2、ProviderPlugin 给每个模块文件提供第三方模块
      3、externals 引入不打包
  ```
