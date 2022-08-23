---
id: 系统API
---

普通页面除了能使用业务接口外，还有一些内置的系统 API 可以用使用。

## 模型数据接口

在爱速搭平台完成数据建模后，对应的数据模型自动就会有一套增删改查的 restful 接口供普通页面设计使用。

![er](/img/API/系统API/er@2x.png)

以下的例子都将以这个模型作为参考说明。

### 列表接口

地址：`model://数据源key.模型key`  
说明：用来获取模型数据列表  
参数：

- `page` 分页信息，从 1 开始，数字 1 表示第一页，数字 2 表示第二页，以此类推
- `perPage` 每页返回多少条数据，默认是 10 条
- `其他过滤字段` 请往下看
- `__relations` 级联查询关系数据，默认一对一，多对一的关系表字段是默认加载，但是多对多，一对多则不会，如果想级联查询这些表，则需要通过这个参数指定。格式是数组，配置如: `model://xxx.xxx?__relations[]=a&__relations[]=b`

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

查询条件相当于：txt 字段可以是 B1 或者 txt 字段可以可是 B2。

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

待续

### 详情接口

待续

### 删除接口

待续

### 选项接口

待续

### 批量修改接口

待续

### 批量修改接口

待续

### 初始值接口

待续

### 导出 excel 接口

待续

### excel 导入接口

待续

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
