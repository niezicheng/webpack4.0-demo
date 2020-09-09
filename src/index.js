// webpack打包图片
import './index.css';
// file-loader 默然会在内部生成一张图片到 build 目录下并把生成的图片名字返回回来
// 1、js中创建图片
import img from './image/my-head.jpg'; // 返回结果是一个新的图片地址
console.log(img);
let image = new Image();
image.src = img; // 就是一个普通的字符串
document.body.appendChild(image);
// 2、css中引入 background('url)

// 3、<img src="" alt=""  />


// import $ from 'jquery';
// import $ from 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery'; // 内联 loader
// expose-loader 暴露全局的loader 内联的 loader
// pre 前面执行的 loader、normal 普通loader、 内联 loader、 post 后置 loader
// console.log(window.$);

console.log($); // 在每个模块中注入 $ 对象

// 引入第三方模块的方式
// 1、expose-loader 暴露到window
// 2、ProviderPlugin 给每个模块文件提供第三方模块
// 3、引入不打包

// const str = require('./a.js');

// console.log(str);

// require('./index.css');

// require('./index.less');

// let fn = () => {
//   console.log('11111')
// }

// fn();

// @log
// class A { // new A() a = 1
//   a = 1;
// }

// let a = new A();
// console.log(a.a);

// // 装饰器使用
// function log(target) {
//   console.log(target); // A类
// }