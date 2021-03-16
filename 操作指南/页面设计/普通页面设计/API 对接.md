  
普通页面支持 API 的方式对接外部接口，实现灵活扩展，API 详情请参考 [amis 文档](https://baidu.gitee.io/amis/zh-CN/docs/types/api)。

在爱速搭中有两个特殊功能：

## 代理

爱速搭所有请求都会经过代理，并且附上爱速搭特有的 header，如下所示

- `x-isuda-token`，在「应用设置」中的 token
- `x-isuda-appkey`，应用短路径
- `x-isuda-env`，应用环境，开发环境是 `dev`，其他环境是那个环境的版本号
- `x-isuda-userid`，用户在爱速搭中的 id
- `x-isuda-username`，用户名
- `x-isuda-oauth-id`，oauth id
- `x-isuda-oauth-access-token`，oauth 的 access token
- `x-isuda-roles`，用户所属的角色名列表

## 如果不想经过内置代理

可以在 url 前加上 `raw:`，就不会走代理。

需要解决跨域问题，比如返回跨域 header：示例如下

- `Access-Control-Allow-Origin: *`，或者爱速搭部署的域名
- `Access-Control-Allow-Methods: POST, GET, OPTIONS`

如果接口需要登录，可以在未登录的时候返回 401，内容是：

```json
{
  "location": "http://跳转登录的页面地址"
}
```
