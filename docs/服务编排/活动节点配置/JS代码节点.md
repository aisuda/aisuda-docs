## 概述
JS节点可以通过js代码自定义编写节点执行内容，该节点配置面板包含节点标题和源码两部分。

## 配置面板
![image.png](/img/服务编排/script-01.png)

### 1. 节点标题
可以配置节点的标题，修改节点标题后，左侧画布中节点的展示也会进行修改，便于对节点进行说明，默认为「JS 代码」。
### 2. 源码
#### 2.1 源码的基础结构如下：
```javascript
module.exports = function (event, state) {
  // do something
  return state
}
```
**参数说明：**
- event: 请求的事件参数，其结构如下
```javascript
interface Event {
  type: 'http'; // 类型，固定值为'http'
  url: string; // 请求的url
  method: string; // 请求方法，'POST' | 'GET'
}
```
- state: 当前上下文对象，各节点产生的变量均会挂载到这个对象中，state中结构如下
```javascript
interface State {
  input: Object; // 输入参数
  output: Object; // 输出参数
  user: { // 用户信息
    name: string; // 用户名
    email: string; // 用户邮箱
    roles: string[]; // 用户角色
  };
  header: {[key in string]: string}; // 请求头信息
  ... // 其他上下文参数
}
```

#### 2.2 示例
##### 2.2.1 上下文变量的获取及定义
```javascript
module.﻿exports = function (﻿event, state﻿) {
  // 从上下文中获取变量
  let count = state.count;
  // 变量处理
  count++;
  // 重新赋值
  state.count = count;

  // 定义新变量
  state.name = 'zhangsan';

  // 编排输出参数均放到了output对象下，通过下面的方式可以直接配置输出结果，(多处赋值output对象时会进行merge)
  state.output = {
     count: state.count,
     name: state.name
  };

  return state
}
```

<!-- ##### 2.2.2 异步处理，可以通过async await方式进行异步处理
```javascript
module.exports = async function (event, state) {
  // 异步函数 demo
  function delay(fn, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fn();
        resolve();
      }, time);
    })
  }
  // 执行异步方法
  await delay(() => { state.count = 10 }, 1000);
  
  // 直接配置输出结果
  state.output = {
     count: state.count
  };
  return state;
}
```

##### 2.2.3 日志打印
执行的结果可以再调试面板中的运行日志中进行查看，会将多个日志结果放到一个字符串数组中
```javascript
module.﻿exports = async function (﻿event, state﻿) {
  // 打印输入参数
  console.log(state.input);
  // 打印输出参数
  console.log(state.output);

  return state
}
``` -->


