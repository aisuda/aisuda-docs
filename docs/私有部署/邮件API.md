---
id: 邮件服务
---

## 邮件SMTP
爱速搭邮件发送是基于 nodemailer 实现的 SMTP 邮件客户端，配置如下：

- `ISUDA_EMAIL_HOST` 邮件主机地址
- `ISUDA_EMAIL_PORT` 邮件服务端口号，默认`587`
- `ISUDA_EMAIL_USER` 邮件服务账号
- `ISUDA_EMAIL_PASS` 邮件服务密码
- `ISUDA_EMAIL_FROM` 邮件发送地址，该地址作为邮件发送者
- `ISUDA_EMAIL_SECURE` 是否开启ssl验证

## 邮件API
爱速搭中的验证码、流程状态通知都需要依赖邮件，如果由于安全或网络隔离等原因无法设置 stmp，就需要自己实现邮件推送接口。

### 使用方法

首先在安装的时候配置 `ISUDA_EMAIL_API` 环境变量，这是个 URL 地址，除了这个变量还能配置 `ISUDA_EMAIL_API_PASSWORD` 来做安全校验，避免接口被第三方调用。

### 邮件 API 的实现参考示例

如果设置了 `ISUDA_EMAIL_API`，爱速搭在发邮件的时候就会向这个地址发请求，使用 JSON 方式提交，将会提交两种格式的数据：

第一种是纯文本

```json
{
  "from": "", // 发件人，可以忽略
  "to": "", // 收件人邮箱
  "bcc": "", // 密送邮箱
  "subject": "", // 邮件标题
  "text": "" // 纯文本内容
}
```

第二种是富文本，和前面的区别是 `text` 变成了 `html`

```json
{
  "from": "", // 发件人，可以忽略
  "to": "", // 收件人邮箱
  "bcc": "", // 密送邮箱
  "subject": "", // 邮件标题
  "html": "" // 纯文本内容
}
```

实现参考示例：

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.post('/email-api', function (req, res) {
  // 这里的 emailOptions 就是前面提到的 json 参数
  const emailOptions = req.body;
  // 如果设置了密码就可以使用如下方式验证
  // const token = req.header('Authorization').replace('Bearer ', '');
  // jwt.verify(token, ISUDA_EMAIL_API_PASSWORD);

  res.end('ok');
});
app.listen(3000);
```
