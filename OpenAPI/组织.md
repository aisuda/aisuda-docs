## 获取应用列表

URL：`GET /openapi/company/{组织短名字}/app`

返回内容：

```json
{
    "status": 0,
    "msg": "",
    "data": [
        {
            "id": "grOwVRwNXG", // 应用 id
            "key": "92a54", // 短名字
            "logo": "",  // logo 图片地址
            "name": "名称",
            "description": "描述",
            "isDraft": false   // 如果从未发布就是 true
        }
}
```
