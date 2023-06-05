---
id: API中心
---

API 中心用于集中管理页面内的 API，比起直接填入 API 的方式，它增加了如下功能：

1. 方便对 API 进行调试
2. 每个 API 可以使用不同的签名方式
3. 支持对提交参数进行转换
4. 支持对返回结果进行转换
5. 自定义证书

## 使用方法

在开发版中左侧进入

![api](/img/API/API中心/api.png)

## 签名方式

目前支持四种签名方式：

- HTTP 帐号密码。
- JWT，将会对所有 query 及 header 及进行签名，写入 header 的 Authorization 字段中。
- 百度云，将会对提交数据及 header 都做签名，写入 header 的 Authorization 字段中
- 第三方签名，将用户信息发送给另外一个接口，返回 token 字段，此 token 写入 header 的 Authorization 字段中。这个 token 将被缓存 15 分钟左右。

## URL 地址替换

「请求地址」支持变量替换，比如这个例子 `http://1.1.1.1/blog/{id}`，其中的 id 是动态的，而在实际前端调用的时候，请求地址是类似 `/api/center/nicaVyNdbGmHicn5b3EKkU`，如何将它映射到目标地址的路径中？

方法是首先在前端请求的时候映射 query，比如 `post:api://nicaVyNdbGmHicn5b3EKkU?id=${id}`，然后在 api 中的 url 地址填写 `http://1.1.1.1/blog/{{query.id}}`

![url-var](/img/API/API中心/url-var.png)

除了 `query` 来获取 query，还有以下其它变量：

- `env`，环境变量
- `input`，提交参数
- `headers`，header

## 提交参数映射

API 中心里的提交参数、Query（URL 参数）、Header 都可以进行修改，转成对应接口所需的格式。

目前参数映射有以下几种方式：

1. 固定值，这个用于固定参数，比如接口需要 `type=1` 这个 query，使用如下方式：
   ![mapping-static](/img/API/API中心/mapping-static.png)
1. 字段名，用于取另一个字段的值，比如将环境变量中的 TYPE 值当作 query 中 type 的值，使用如下方式：
   ![mapping-name](/img/API/API中心/mapping-name.png)
1. 模板引擎转换，使用 [Handlebars](https://handlebarsjs.com/) 模板的结果作为值，比如提交参数中有个 type，值为 1，但对应的接口需要的值是 `1s`，需要加上个 `s`，这时就可以使用模板转换的方式，如下所示：
   ![mapping-tpl](/img/API/API中心/mapping-tpl.png)
1. 公式计算，使用爱速搭中的公式能力进行计算，将结果作为值，比如常见的四则运算。
   ![mapping-formula.png](/img/API/API中心/mapping-formula.png)

注意这个功能和页面中接口的「数据映射」功能类似，大部分情况下更推荐使用页面中的「数据映射」，因为它能够，但不同的是可以对 header 进行映射，并且这是后端实现的。

## 返回结果转换

爱速搭接口所需的返回格式是：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    ...其他字段
  }
}
```

- **status**: 状态码，返回 `0` 表示当前接口正确返回，否则按错误请求处理
- **msg**: 返回接口处理信息，主要用于表单提交或请求失败时的 `toast` 显示
- **data**: 返回的具体数据

同时也兼容以下几种放回格式

1. errorCode 作为 status、errorMessage 作为 msg
2. errno 作为 status、errmsg/errstr 作为 msg
3. error 作为 status、errmsg 作为 msg
4. error.code 作为 status、error.message 作为 msg
5. message 作为 msg

如果返回的内容不是这些格式，或者返回内容不是 JSON，则需要对返回结果进行转换。

转换方法有以下几种：

1. 复制到，用于将所有数据复制到某个字段下
2. 取字段，用于将数据复制到返回结果的某个字段下
3. 删除字段
4. JSON 路径查询
5. 模板，使用 Handlebars 模板对结果进行转换
6. 字符串拆分数组，比如返回结果是 `"1,2,3"`，可以将其转成 `[1,2,3]`
7. 正则，抽取第一个组，通常用于 xml 中直接获取某个数据

这里介绍最常见的「取字段」方法，假设接口返回格式是：

```json
{
  "error": 0,
  "error_msg": "",
  "result": {}
}
```

我们希望转成如下格式

```json
{
  "status": 0,
  "msg": "",
  "data": {}
}
```

就需要通过「取字段」的方式提取这 3 个值到不同位置，如下图所示：

![output-transform](/img/API/API中心/output-transform.png)

## 文件上传

如果是文件上传，请在「请求格式」里设置为「文件上传」。

![upload](/img/API/API中心/upload.png)

## 文件下载

如果是文件下载接口，请开启左下角的「是文件下载」

![download](/img/API/API中心/download.png)
