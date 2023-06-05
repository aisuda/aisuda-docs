## 场景简介

JS 节点可以通过 js 代码自定义编写节点执行内容，该节点配置面板包含节点标题和源码两部分。

![](/img/服务编排/活动节点/其他高级/JS/JS01.png)

## 源码基础结构

**结构如下：**

```javascript
module.exports = function (event, state) {
  // do something
  return state;
};
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

- state: 当前上下文对象，各节点产生的变量均会挂载到这个对象中，state 中结构如下

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

## 常用写法示例

### 上下文变量的获取及定义

```javascript
module.exports = function (event, state) {
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

  return state;
};
```

### 日志打印

执行的结果可以再调试面板中的运行日志中进行查看，会将多个日志结果放到一个字符串数组中

````javascript
module.﻿exports = async function (﻿event, state﻿) {
  // 打印输入参数
  console.log(state.input);
  // 打印输出参数
  console.log(state.output);

  return state
}
```


````
