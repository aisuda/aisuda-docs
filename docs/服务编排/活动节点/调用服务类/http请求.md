## 场景简介

`http请求`节点可以实现通过 http 的方式请求数据。

## 属性概要

<table>
  <thead>
    <tr>
      <th>分类</th><th>属性</th><th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowSpan="5">基本信息</td>
      <td>入参来源</td>
      <td>即请求体的入参来源，支持前端透传，从前端的input中获取入参数据。</td>
    </tr>
    <tr>
      <td>节点出参</td>
      <td>即该请求返回的结果，后续节点可以使用该节点出参。 </td>
    </tr>
    <tr>
      <td>请求地址</td>
      <td>即该http请求的请求地址 </td>
    </tr>
    <tr>
      <td>请求方法</td>
      <td>即该http请求的请求方法，包含get、post、put、delete、patch等。 </td>
    </tr>
    <tr>
      <td>重试次数</td>
      <td>即当请求异常时，重试的次数。 </td>
    </tr>
    <tr>
      <td rowSpan="2">提交参数</td>
      <td>query转换</td>
      <td>支持数据透传，即从前端提交的参数透传到该请求，同时支持追加query模式。</td>
    </tr>
    <tr>
      <td>headers转换</td>
      <td>支持数据透传，即从前端提交的参数透传到该请求，同时支持追加headers模式。</td>
    </tr>
    <tr>
      <td rowSpan="3">返回结果</td>
      <td>文件下载</td>
      <td>开启后则为文件下载模式，返回结果为文件。</td>
    </tr>
    <tr>
      <td>返回结果转换</td>
      <td>对返回的结果进行转换，提供多种转换方式。</td>
    </tr>
    <tr>
      <td>返回结果适配</td>
      <td>通过代码进行结果的适配。</td>
    </tr>
    <tr>
      <td >认证鉴权</td>
      <td>认证鉴权</td>
      <td>支持多种认证鉴权方式，包括http账号密码、JWT、第三方签名、百度云等。</td>
    </tr>
  </tbody>
</table>


界面如图所示：

![](/img/服务编排/活动节点/调用服务类/http请求/http请求01.png)
