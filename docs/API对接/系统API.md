---
id: 系统API
---

普通页面除了能使用业务接口外，还有一些内置的系统 API 可以用使用。

## 模型数据接口

在爱速搭平台完成数据建模后，对应的数据模型自动就会有一套增删改查的 restful 接口供普通页面设计使用。

![er](/img/API/系统API/er@2x.png)

以下的例子都将以这个模型作为参考说明。需要特别注意的是 tablea 和 tableb 有个一对多的关系，关系字段叫 bList，tableb 和 tablea 有个多对一的关系，关系字段叫 a，外键是 aId。

### 列表接口

方式: `GET`  
地址：`model://数据源key.模型key`  
说明：用来获取模型数据列表  
参数：

- `page` 分页信息，从 1 开始，数字 1 表示第一页，数字 2 表示第二页，以此类推
- `perPage` 每页返回多少条数据，默认是 10 条
- `orderBy` 可以指定表中的字段名
- `orderDir` 发送 asc 或者 desc
- `其他过滤字段` 请往下看
- `__keywords` 请看下面的关键字检索
- `__relations` 级联查询关系数据。一对一，多对一的关系表字段是默认加载，但是多对多，一对多则不会，如果想级联查询这些表，则需要通过这个参数指定。格式是数组，例如: `model://xxx.xxx?__relations[]=a&__relations[]=b`

返回参考：

```
{
  status: 0,
  msg: '',
  data: {
    items: [],
    count: 0
  }
}
```

#### 简单字段过滤

模型中字段可以直接拿来过滤比如 tableB 里面的 txt 字段。

`model://datasource.tableb?txt=B1`

这样请求的列表只会返回 txt 字段等于 B1 的项。

多对一关系表中字段也同样可以用来检索。

`model://datasource.tableb?a[txt]=A1`

注意看模型设计，tableB 有个多对一关系关联 tableA，且关系字段的字段名是 a

注意：多个字段查询是并且的关系

#### 过滤模式设定

如果不指定过滤模式，默认就是等于，如果想要指定过滤模式，则可以像这样查询。

`model://datasource.tableb?txt[like]=B1`

也就是说字段里面可以跟个 op 来指定匹配类型。目前支持 op 指令有：

- `eq` 等于，不设置也是这个模式
- `ne` 不等于
- `gt` 大于
- `ge` 大于或等于
- `lt` 小于
- `le` 小于或等于
- `like` 模糊匹配
- `sw` 匹配开头，startWith
- `ew` 匹配结尾，endWith
- `bt` 范围匹配，这里因为需要两个值，所以是这样查询 `model://datasource.tableb?txt[bt][from]=xxx&txt[bt][to]=xxx`
- `in` 包含，这个要求传入是个数组，所以是这样查询 `model://datasource.tableb?txt[in][]=x1&txt[in][]=x2`

多对一关系模型中的字段也同样支持这个语法如：`model://datasource.tableb?a[txt][like]=A1`

注意：多个字段查询是并且的关系

#### 关键字检索

如果想通过关键字查询多个字段，可以通过 `__keywords` 来查询，查询格式如：

`model://datasource.tableb?__keywords[txt,num]=a`

意思是关键字 a 同时搜索表中的 txt 和 num 字段，将匹配结果查询出来。

#### 高级过滤模式

前面用到的字段查询规则，其实是没办法设置「或者」组合的，如果要实现这种复杂组合，则需要通过 `__filter` 参数来指定规则。

值格式配置如下：

```ts
type ValueGroup = {
  conjunction: 'and' | 'or';
  children: Array<ValueGroup | ValueItem>;
};
type ValueItem = {
  // 左侧字段，这块有预留类型，不过目前基本上只是字段。
  left: {
    type: 'field';
    field: string;
  };

  // 还有更多类型，暂不细说
  op: 'equals' | 'not_equal' | 'less' | 'less_or_equal';

  // 根据字段类型和 op 的不同，值格式会不一样。
  // 如果 op 是范围，right 就是个数组 [开始值，结束值]，否则就是值。
  right: any;
};

type Value = ValueGroup;
```

具体请[前往 amis 文档查看](http://aisuda.bce.baidu.com/amis/zh-CN/components/form/condition-builder)

示例： `model://datasource.tableb?__filter[conjunction]=or&__filter[children][0][op]=equal&__filter[children][0][left][type]=field&__filter[children][0][left][field]=txt&__filter[children][0][right]=B1&__filter[children][1][op]=equal&__filter[children][1][left][type]=field&__filter[children][1][left][field]=txt&__filter[children][1][right]=B2`

查询条件相当于：txt 字段可以是 B1 或者 txt 字段可以是 B2。

left.field 里面的值除了可以是当前模型中的字段也可以是多对一关联表中的字段如：

`model://datasource.tableb?__filter[conjunction]=or&__filter[children][0][op]=equal&__filter[children][0][left][type]=field&__filter[children][0][left][field]=txt&__filter[children][0][right]=B3&__filter[children][1][op]=equal&__filter[children][1][left][type]=field&__filter[children][1][left][field]=a.txt&__filter[children][1][right]=A1`

查询条件相当于：txt 字段可以是 B3 或者 多对一关联表 a 中的 txt 字段可以是 A1

如果觉得在 query 中拼接 `__filter` 字段比较麻烦，可以通过 body 传递，可以以 json 的格式发送过来如

```
{
  "__filter": {
    "conjunction": "or",
    "children": [
      {
        "op": "equal",
        "left": {
          "type": "field",
          "field": "txt"
        },
        "right": "B1"
      },
      {
        "op": "equal",
        "left": {
          "type": "field",
          "field": "txt"
        },
        "right": "B2"
      }
    ]
  }
}
```

> GET 接口也能发送 body？当然不能！至少 chrome 浏览器是不允许的！所以只能用 method-override 方式，也就是说 header 里面加个 `X-HTTP-Method-Override` 为 GET。这样实际发送是 POST，但是后端会认为是 GET 请求，所以依然是列表查询接口。

### 新增接口

方式: `POST`  
地址：`model://数据源key.模型key`  
说明：用来添加一条记录，接口地址和列表接口是一样的，只是请求方式变成了 `POST`  
参数： 请求体需要将这个表对应的必填字段带上（除了自增 id），格式可以是 json 也可以是 form 或者 form-data  
示例：

```
{
  "txt":"1111",
  "num":1111,
  "date":"2022-08-24 00:00:00",
  "a":{
    "id":1
  }
}
```

或者

```
{
  "txt":"1111",
  "num":1111,
  "date":"2022-08-24 00:00:00",
  "aId":1
}
```

对于对一关系字段，添加时指定外键或者直接通过关系字段绑定都可以。那如果是对多关系，则只能通过关系字段指定比如：

```
{
  "txt":"1111",
  "num":1111,
  "date":"2022-08-24 00:00:00",
  "bList": [
    {
      "id": 1
    },
    {
      "txt":"1111",
      "num":1111,
      "date":"2022-08-24 00:00:00",
    }
  ]
}
```

以上是一个主表顺带添加子表的例子，如果成员里面有主键，则是直接关联（比如第一个成员），如果没有则会创建一个新子表数据与之关联（比如第二个成员）。

返回参考：

```
{
  status: 0,
  msg: ''
}
```

### 详情接口

方式: `GET`  
地址：`model://数据源key.模型key/:id`  
说明：用来查询表的单条数据详情  
参数： 除了请求路径中带上 id 外，额外还有一些参数可以使用

- `其他过滤字段` 请看列表接口中字段过滤规则，详情接口与之一致。
- `__relations` 级联查询关系数据。如果想级联查询这些表，则需要通过这个参数指定。格式是数组，例如: `model://xxx.xxx?__relations[]=a&__relations[]=b`

通常路径中通过 id 基本上能定位到是哪一条数据了，查询条件已经没有意义了，如果不确定是哪一条数据，想通过字段过滤，则请将 id 指定为 0 如：

`model://datasource.tableb/0?txt=B1`

### 修改接口

方式: `POST`  
地址：`model://数据源key.模型key/:id`  
说明：可以参考新增接口，格式要求要求，但是请求路径要求指定数据 id

### 删除接口

方式: `DELETE`  
地址：`model://数据源key.模型key/:id`  
说明：用来删除数据，支持删除多个，多个 id 用英文逗号隔开如： `delete:model://datasource.tableb/1,2`

### 选项接口

方式: `GET`  
地址：`model://数据源key.模型key/options`  
说明： 用来实现选项类关联模型数据录入，默认只会返回主键 id 和标题字段，如果觉得返回的字段不够可以通过 `__fields` 参数扩充。如：`model://datasource.tableb/options?__fields[]=date&__fields[]=num`  
参数：

- `__fields` 扩充查询字段，目前仅支持当前表的字段。

### 批量修改接口

方式：`POST`  
地址： `model://数据源key.模型key/bulkUpdate`  
说明：请求体 json 格式，需要更新的数据放在 items 数组中，每个成员必须主键 id 字段，以及其他要更新的字段。  
参数：无  
内容：

```
{
  items: [
    {
      id: 1,
      ...其他字段
    }
  ]
}
```

### 初始值接口

方式: `GET`  
地址：`model://数据源key.模型key/scaffold`  
说明：用来辅助新增，给新增表单提供初始化数据。

### excel 模板导出

方式: `GET`  
地址：`model://数据源key.模型key/downloadExcelTemplate`  
说明：用来导出 excel 模板，用来给 excel 导入功能提供参考。

### 导出 excel 接口

方式: `GET`  
地址：`model://数据源key.模型key/exportExcelData`  
说明：导出当前表的数据成 excel 文件。

### excel 导入接口

方式: `POST`  
地址：`model://数据源key.模型key/UploadExcelData`  
说明：通过 excel 文件导入数据，文件格式请参考 excel 模板导出的文件。请求体为 form-data 格式，文件放在 file 字段中， 可以通过 `labelNameMap` 做列名到字段名之间的映射。

## 部门选择接口

地址：`company://department`  
说明：用来获取部门信息，主要给部门选择组件使用。  
参数：

- `parent` 用来指定父级部门，如果不传返回的是顶级部门，如果传了就是返回该部门下面子部门

返回参考：

```
{
  status: 0,
  msg: '',
  data: {
    options: [
      {
        label: '部门名称',
        value: 'xxxxx',

        children: [
          {
            label: '子部门',
            value: 'xxxx'
          }
        ]
      }
    ]
  }
}
```

## 人员选择接口

### 人员穿梭框接口

方式: `GET`  
地址：`company://user/transfer-options`  
说明：用来获取用户信息，主要给用户选择组件使用
参数：无  
返回参考：

```
{
  status: 0,
  msg: '',
  data: {
    options: {
      leftDefaultValue: '',
      leftOptions: [
        {
          label: '部门名称',
          value: 'xxxxx',

          children: [
            {
              label: '子部门',
              value: 'xxxx'
            }
          ]
        }
      ],
      children: [
        {
          ref: 'xxxxx',
          children: [
            {
              label: 'xxxxUser',
              value: 'xxxUser@aisuda.com'
            }
          ]
        }
      ]
    }
  }
}
```

可以参考前端 Transfer 关联选择模式的说明：/amis/zh-CN/components/form/transfer#%E5%85%B3%E8%81%94%E9%80%89%E6%8B%A9%E6%A8%A1%E5%BC%8F

### 人员懒加载接口

方式: `GET`  
地址：`company://user/options`  
说明：用来懒加载子部门信息以及部门下的人员信息，两个模式根据传入的参数是 parentId 还是 departmentId，如果是部门 id 则是获取人员信息，如果是 parentId 则返回子部门信息
参数：

- `parentId` 部门选项的值
- `departmentId` 部门选项的值

返回参考：

```
{
  status: 0,
  msg: '',
  data: {
    options: [
      {
        label: 'xxx',
        value: 'xxxxx'
      }
    ]
  }
}
```

### 人员搜索接口

方式: `GET`  
地址：`company://user/autoComplete`  
说明：用来检索用户，基于关键字返回匹配的用户列表，这个接口主要也是给人员选择组件使用
参数：

- `term` 关键字

返回参考：

```
{
  status: 0,
  msg: '',
  data: {
    options: [
      {
        label: 'xxx',
        value: 'xxxxx'
      }
    ]
  }
}
```
