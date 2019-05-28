/**
 * Promise 异步读取文件示例
 */
const fs = require('./fileSystem');

fs.readFile('../README.md', 'utf-8')
.then((value) => {
  console.log(value);
});