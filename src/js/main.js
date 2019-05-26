import { Test } from './lib/sub';
const test = new Test();
test.hello();

const promisetest = new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, 5000);
});

promisetest.then(() => {
  console.log('次の処理');
});

let bar = 10;
const hoge = `hogehoge${bar}`;
console.log(hoge);
