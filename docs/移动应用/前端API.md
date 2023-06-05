---
id: 前端API
---

使用前端 API 可以在自定义动作、代码数据绑定等场景更灵活的操作数据、实现更复杂的交互场景等。

### 可视化动作接口

使用 triggerAction 可触发执行平台里的支持的动作，例如跳转页面、修改变量等。常用动作说明如下

**跳转 URL**

```
// 打开百度首页
this.triggerAction({
    action: 'URL',
    url: 'https://www.baidu.com' // 支持deeplink
})
```

**跳转页面**

```
// 跳转应用内页面，path或page至少填写一个
this.triggerAction({
    action: 'REDIRECT-PAGE',
    path: '页面路径，可选',
    page: '页面ID, 可选'
})
```

**返回上一页**

```
this.triggerAction({
    action: 'BACK'
})
```

**刷新页面数据**

```
this.triggerAction({
    action: 'RELOAD'
})
```

**打开弹框**

```
this.triggerAction({
    action: 'OPEN-MODAL',
    nodeId: '组件ID'
})
```

**关闭弹框**

```
this.triggerAction({
    action: 'CLOSE-MODAL',
    nodeId: '组件ID'
})
```

**数据源初始化数据**

```
this.triggerAction({
    action: 'DATA-INIT',
    dsId: '数据源ID',
    value: {}, // 初始化数据，一般是对象
    dataType: 'output' // input输入参数, output输出参数
})
```

**数据源字段赋值**

```
this.triggerAction({
    action: 'DATA-ASSIGN',
    dsId: '数据源ID',
    inputFields: [ // 输入参数赋值，可选
        {
            key: 'title', // 字段标识,
            value: '值'
        }
    ],
    ouputFields: [ // 输出参数赋值，可选
        {
            key: 'title', // 字段标识,
            value: '值'
        }
    ],
})
```

**执行自定义动作**

```
this.triggerAction({
    action: 'CODE',
    id: '自定义动作ID'
})
```

**消息提示**

```
this.triggerAction({
    action: 'TOAST',
    message: '内容',
    type: 'info', // 提示类型
    duration: 2000, // 持续时间，毫秒
})
```

### 前端 API 接口

使用前端底层 API 接口可以更精确的操作数据等，常用 API 如下：

#### getVariableValue

读取页面/应用变量，传入变量 ID 参数 getVariableValue(id)

| 属性 | 类型   | 默认值 | 必填 | 说明    |
| ---- | ------ | ------ | ---- | ------- |
| id   | 字符串 | 无     | 是   | 变量 ID |

**示例**

```javascript
let value = this.getVariableValue('v1'); // 返回变量值
console.log('变量v1', value);
```

#### setVariableValue

设置页面/应用变量值，传入变量 ID 与变量值: setVariableValue(id, value)

| 属性  | 类型                 | 默认值 | 必填 | 说明    |
| ----- | -------------------- | ------ | ---- | ------- |
| id    | 字符串               | 无     | 是   | 变量 ID |
| value | 字符串、对象、数组等 | 无     | 是   | 变量值  |

**示例**

```javascript
this.setVariableValue('v1', 'hello world');
console.log('变量v1赋值后', this.getVariableValue('v1'));
```

#### getParamValue

读取当前页面参数(页面入参)值，传入参数 ID 参数 getParamValue(id)

| 属性 | 类型   | 默认值 | 必填 | 说明    |
| ---- | ------ | ------ | ---- | ------- |
| id   | 字符串 | 无     | 是   | 参数 ID |

**示例**

```javascript
let value = this.getParamValue('id');
console.log('参数结果', value);
```

#### getDataSource

读取数据源数据，返回整个数据源 store，里面包含数据源输入输出数据，输出数据为 data 字段，api 输入数据为 inputData 字段。

| 属性 | 类型   | 默认值 | 必填 | 说明      |
| ---- | ------ | ------ | ---- | --------- |
| id   | 字符串 | 无     | 是   | 数据源 ID |

**示例**

```javascript
let store = this.getDataSource('id');
console.log('数据源', store.data, store.inputData);
```

#### getDynamicFieldValue

读取数据源数据指定字段数据，如 this.getDynamicFieldValue(id, field, index, type)。

| 属性  | 类型   | 默认值 | 必填 | 说明                                            |
| ----- | ------ | ------ | ---- | ----------------------------------------------- |
| id    | 字符串 | 无     | 是   | 数据源 ID                                       |
| field | 字符串 | 无     | 是   | 字段标识，如 name                               |
| index | 数字   | 0      | 否   | 索引位置，从 0 开始，如果从列表中读取字段需提供 |
| type  | 字符串 | output | 否   | 数据类型，输出参数:output 输入参数: input       |

**示例**

```javascript
// 读取数据
let value = this.getDynamicFieldValue('a001', 'title', 2, 'output');
console.log('列表数据源输出参数第3项的title字段是', value);
```

#### callAPI

请求 API，传递请求参数对象 object: this.callAPI(object,)。object 参数说明:

| 属性       | 类型   | 默认值 | 必填 | 说明                                                       |
| ---------- | ------ | ------ | ---- | ---------------------------------------------------------- |
| api        | 字符串 | 无     | 否   | API 在平台 API 中心里面的标识，与 url 参数必须填写其中一个 |
| url        | 字符串 | 无     | 否   | http 请求地址，与 api 参数必须填写其中一个                 |
| method     | 字符串 | GET    | 否   | API 请求类型                                               |
| data       | 对象   | 无     | 否   | 传递数据 JSON 对象                                         |
| header     | 对象   | 无     | 否   | 自定义 header 对象                                         |
| isDownload | 布尔   | false  | 否   | 是否下载接口                                               |
| isUpload   | 布尔   | false  | 否   | 是否上传接口                                               |

**示例**

```javascript
// 调用api中心配置的接口
let res = await this.callAPI({
  api: 'apiKey',
  data: {
    a: 'aa',
    b: 'bb'
  }
});

console.log('返回结果', res);

// 调用自定义的接口
let res2 = await this.callAPI({
  url: 'https://xx.com',
  method: 'GET',
  data: {
    page: 2,
    limit: 10
  }
});
console.log('返回结果', res2);
```
