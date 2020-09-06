const str = require('./a.js');

console.log(str);

require('./index.css');

require('./index.less');

let fn = () => {
  console.log('11111')
}

fn();

@log
class A { // new A() a = 1
  a = 1;
}

let a = new A();
console.log(a.a);

// 装饰器使用
function log(target) {
  console.log(target); // A类
}