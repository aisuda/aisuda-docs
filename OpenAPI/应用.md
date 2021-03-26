## 整体说明

应用 API 可以使用组织的密钥或者应用级别密钥。

所有接口路径前缀都是 `/openapi/company/{组织短名字}/app/{应用短名字}/`，需要将路径中的短名字换成实际的值，比如 `/openapi/company/50b55/app/6a814/`

## 应用整体接口

### 获取应用下的所有资源

获取应用下的所有资源，用于外部系统控制爱速搭的权限分配。

地址：`GET /openapi/company/{组织短名字}/app/{应用短名字}/resources`

返回示例：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "page": {
      "name": "页面",
      "items": [
        {
          "id": "k1Jw8ME8Gq",
          "name": "页面名"
        }
      ]
    },
    "dataModel": {
      "name": "数据模型",
      "items": [
        {
          "id": "M9QEWvywp8",
          "name": "数据模型名"
        }
      ]
    },
    "dataSource": {
      "name": "数据源",
      "items": [
        {
          "id": "k1Jw8ME8Gq",
          "name": "数据源名"
        }
      ]
    },
    "component": {
      "name": "自定义组件",
      "items": [
        {
          "id": "LM6wPMEJdb",
          "name": "自定义组件名"
        }
      ]
    },
    "APICenter": {
      "name": "API",
      "items": [
        {
          "id": "pezEbloLAB",
          "name": "api名"
        }
      ]
    },
    "APICenterGroup": {
      "name": "API 分组",
      "items": [
        {
          "id": "grOwVRwNXG",
          "name": "分组名"
        }
      ]
    },
    "role": {
      "name": "角色",
      "items": [
        {
          "id": "pezEbloLAB",
          "name": "应用管理员"
        }
      ]
    }
  }
}
```

## 角色相关接口

### 获取应用下的角色列表

地址：`GET /openapi/company/{组织短名字}/app/{应用短名字}/role`

返回示例：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "items": [
      {
        "name": "应用管理员", // 角色名称，角色名称在一个应用内不可重名
        "id": "pezEbloLAB", // 角色唯一 id
        "description": "系统自动创建，应用级别角色，只在应用「nw」中可见。", // 描述新
        "scope": "app", // 这是应用级别
        "isBultin": true, // 是否是默认创建的
        "editable": true, // 是否可编辑
        "deleteable": true // 是否可删除
      }
    ]
  }
}
```

### 创建应用内角色

地址：`Post /openapi/company/{组织短名字}/app/{应用短名字}/role`

提交内容：`{"name": "角色名"}`

### 删除角色

地址：`Delete /openapi/company/{组织短名字}/app/{应用短名字}/role/{角色 id}`

需要将角色 id 放到 url 中

### 获取角色中的用户列表

地址：`Get /openapi/company/{组织短名字}/app/{应用短名字}/role/{角色 id}/member`

返回示例：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    // 角色下包含的用户类别
    "users": [
      {
        "nickName": "xxx", // 用户昵称
        "email": "xxx@yyy.com", // 用户邮箱
        "roleId": "l2pEKAo1Ry",
        "id": "XdkEyJZMRp", // 用户 id
        "removable": true
      }
    ],
    // 角色下包含的部门列表
    "departments": [
      {
        "roleId": "l2pEKAo1Ry",
        "id": "4MDE4xELmX", // 部门 id
        "name": "部门名"
      }
    ],
    // 角色下包含的角色列表
    "roles": [
      {
        "roleId": "l2pEKAo1Ry",
        "id": "3Y4wzNwQ7P",
        "name": "子角色名"
      }
    ]
  }
}
```

### 往角色中添加用户

地址：`Post /openapi/company/{组织短名字}/app/{应用短名字}/role/{角色 id}/member/user`

提交内容：`{"email": "xxx@yyy.com"}`

### 往角色中添加角色

地址：`Post /openapi/company/{组织短名字}/app/{应用短名字}/role/{角色 id}/member/role`

提交内容：`{"role": " 角色 ID"}`

## 权限相关接口

### 获取应用下有哪些 ACL 配置项

用于告知第三方爱速搭中有哪些可以配置的权限，比如页面可以配置「可见」、「可写」、「可删」这三项。

地址：`Get /openapi/company/{组织短名字}/app/{应用短名字}/acl/options`

返回示例：

```json
{
  "status": 0,
  "msg": "",
  "data": [
    {
      "name": "page",
      "options": [
        {
          "name": "read",
          "label": "可见"
        },
        {
          "name": "write",
          "label": "可写"
        },
        {
          "name": "delete",
          "label": "可删"
        }
      ]
    },
    {
      "name": "dataModel",
      "options": [
        {
          "name": "read",
          "label": "可见"
        },
        {
          "name": "write",
          "label": "可写"
        },
        {
          "name": "delete",
          "label": "可删"
        }
      ]
    },
    {
      "name": "dataSource",
      "options": [
        {
          "name": "read",
          "label": "可见"
        },
        {
          "name": "write",
          "label": "可写"
        },
        {
          "name": "delete",
          "label": "可删"
        }
      ]
    },
    {
      "name": "component",
      "options": [
        {
          "name": "read",
          "label": "可见"
        },
        {
          "name": "write",
          "label": "可写"
        },
        {
          "name": "delete",
          "label": "可删"
        }
      ]
    },
    {
      "name": "APICenter",
      "options": [
        {
          "name": "read",
          "label": "可见"
        },
        {
          "name": "write",
          "label": "可写"
        },
        {
          "name": "delete",
          "label": "可删"
        },
        {
          "name": "call",
          "label": "调用"
        }
      ]
    },
    {
      "name": "APICenterGroup",
      "options": [
        {
          "name": "read",
          "label": "可见"
        },
        {
          "name": "write",
          "label": "可写"
        },
        {
          "name": "delete",
          "label": "可删"
        }
      ]
    },
    {
      "name": "role",
      "options": [
        {
          "name": "write",
          "label": "可写"
        },
        {
          "name": "delete",
          "label": "可删"
        }
      ]
    }
  ]
}
```

### 设置某个角色所拥有的资源权限

地址：`Post /openapi/company/{组织短名字}/app/{应用短名字}/role/{角色 id}/acl/role`

提交内容示例，提交内容是数组，可以同时设置多个资源的权限：

```json
[
  {
    "type": "APICenter", // 修改 api 中心的权限
    "id": "LM6wPMEJdb", // 对应的 api id
    "acl": {"read": true, "write": false, "call": true, "delete": false} // 权限详情，具体某个资源有哪些请参考前面接口返回的内容
  },
  {
    "type": "page", // 修改某个页面的权限
    "id": "dl6EgeojP1", // 对应的页面 id
    "acl": "*" // 除了前面说到的方式，还可以使用 * 来方便设置这个资源的所有权限
  }
]
```
