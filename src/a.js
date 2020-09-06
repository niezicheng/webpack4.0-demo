module.exports = 'hello webpack!';
import '@babel/polyfill';

class B {}

function * gen(params) {
  yield 1;
}
console.log(gen().next());

'str'.includes('s');