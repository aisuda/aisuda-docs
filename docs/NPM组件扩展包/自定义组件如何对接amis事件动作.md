---
id: 自定义组件如何对接amis事件动作
---

### 1、自定义组件如何使用amis事件动作？
所有组件（包括自定义组件）可通过onEvent属性实现渲染器事件与响应动作的绑定。

动作包含通用动作、组件动作、广播动作、自定义动作，可以通过配置actionType来指定具体执行什么动作。
通用动作包含发送 http 请求、跳转链接、浏览器回退、浏览器刷新、打开/关闭弹窗、打开/关闭抽屉、打开对话框、弹出 Toast 提示、复制、发送邮件、刷新、控制显示隐藏、控制启用禁用状态、更新数据。这些通用动作都是amis内置的，可以在自定义组件中直接使用。（手动配置onEvent）

自定义组件可通过 props.dispatchEvent 来设置一个渲染器事件（比如 ‘custom-widget-event’），自定义组件本身可以在 onEvent中设置监听这个事件（比如 ‘custom-widget-event’），并关联对应的动作（可以设置amis中通用动作，比如刷新页面）。

### 2、其他组件如何触发自定义组件的动作？
1、首先自定义组件需要指定 contextType 读取当前的 scope context（static contextType = ScopedContext），并把自己注册在这个scope上（scoped.registerComponent(this)），以便其他组件能通过 componentId 找到这个自定义组件；

2、其次，需要在自定义组件中补充 doAction，用于接收外部组件触发的事件动作，如下所示：
![image](/img/NPM组件扩展包/custom-widget-doAction.png)

3、然后其他组件就可以通过配置componentId来触发自定义组件的动作：
![image](/img/NPM组件扩展包/dispatch-custom-event.png)

备注1：普通react自定义组件对接amis事件动作示例见 https://github.com/aisuda/react-custom-widget-template/commit/43c637b790ea2ee9f7ff6f8faf654cc82c602101；
备注2：vue自定义组件无需设置ScopedContext，amis-widget会自动设置ScopedContext 【开发中，待发布】。
