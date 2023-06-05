## 场景简介

Mock 服务主要是通过自定义 JS 脚本，在开发环境的预览态，实现对服务的 mock 功能。

## 设置 Mock

在 API 中心，选择需要 mock 的服务，点击更多中的『mock』选项，点击后进入设置弹出设置 mock 的窗口。mock 功能的 js 代码示例和返回格式如下：

![image-20220925155100443](/img/服务编排/服务编排设计/mock服务编排/mock.jpg)

mock 数据设置实例

```
module.exports = (req) => {
  return
{
    "status": 0,
    "msg": "mock请求成功",
    "data": {}
  }
}
```

## 开启 mock

在开发环境下，点击『预览』，进入预览态。 在预览态下的浏览设置中，开启『API Mock』。

开启后，对 API 中心的接口请求时，不会实际请求 API 中心的节点，而是直接执行配置好的 mock 脚本进行返回。

![image-20220925155629274](/img/服务编排/服务编排设计/mock服务编排/mock02.png)
