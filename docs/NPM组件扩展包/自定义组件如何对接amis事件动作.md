---
id: 自定义组件如何对接amis事件动作
---

### 一、自定义组件如何使用amis事件动作？
所有组件（包括自定义组件）可通过onEvent属性实现渲染器事件与响应动作的绑定。

动作包含通用动作、组件动作、广播动作、自定义动作，可以通过配置actionType来指定具体执行什么动作。
通用动作包含发送 http 请求、跳转链接、浏览器回退、浏览器刷新、打开/关闭弹窗、打开/关闭抽屉、打开对话框、弹出 Toast 提示、复制、发送邮件、刷新、控制显示隐藏、控制启用禁用状态、更新数据。这些通用动作都是amis内置的，可以在自定义组件中直接使用。（手动配置onEvent）

自定义组件可通过 props.dispatchEvent 来设置一个渲染器事件（比如 ‘custom-widget-event’），自定义组件本身可以在 onEvent中设置监听这个事件（比如 ‘custom-widget-event’），并关联对应的动作（可以设置amis中通用动作，比如刷新页面）。

### 二、其他组件如何触发自定义组件的动作？
1、首先自定义组件需要指定 contextType 读取当前的 scope context（static contextType = ScopedContext），并把自己注册在这个scope上（scoped.registerComponent(this)），以便其他组件能通过 componentId 找到这个自定义组件；

2、其次，需要在自定义组件中补充 doAction，用于接收外部组件触发的事件动作，如下所示：
![image](/img/NPM组件扩展包/custom-widget-doAction.png)

3、然后其他组件就可以通过配置componentId来触发自定义组件的动作：
![image](/img/NPM组件扩展包/dispatch-custom-event.png)

备注1：普通react自定义组件对接amis事件动作见[示例](https://github.com/aisuda/react-custom-widget-template/commit/43c637b790ea2ee9f7ff6f8faf654cc82c602101)；

备注2：vue自定义组件无需设置ScopedContext，amis-widget会自动设置ScopedContext，只需补充doAction方法，见[示例](https://github.com/aisuda/multiple-custom-widget-template/commit/65c6e8f6fc00cded77a8005ff416fdcc1a5b02fd)（需确保amis-widget版本为3.0.9或以上）。

### 三、对接amis事件动作注意事项
1、自定义组件中添加的事件动作如果和amis通用事件一样，会被忽略（使用amis通用动作）。  
建议1: 自定义组件中避免设置和amis通用事件一样的actionEvent；  
建议2: 优化amis Action执行逻辑，存在componentId则优先使用组件渲染器事件；【[已优化](https://github.com/baidu/amis/pull/6199)】  ∂∂∂

2、触发广播事件时，需要设置 action.args.eventName 或 action.eventName，用于广播出去一个自定义组件；

3、A组件在渲染时触发一个广播事件（比如：custom-widget-broadcast），B组件监听这个广播事件，如果B组件在A组件 之后渲染，则B组件会监听不到A组件的广播事件。  
建议：应避免在组件渲染时触发广播事件。

4、自定义组件中可补充amis动作事件（新的通用动作），见[补充方法](https://aisuda.bce.baidu.com/amis/zh-CN/docs/concepts/event-action#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8A%A8%E4%BD%9C)。