---
id: Angular组件
---

React、Vue、jQuery 组件都可以通过自定义组件的方式引入，但 Angular 不行，因为 Angular 本身是一个框架，它除了 UI 以外还内置了路由和数据请求等功能，导致 Angular 组件并不能直接嵌入到其它框架中。

目前要嵌入 Angular 组件，需要进行三步操作：

1. 对 Angular 组件进行改造，支持打包为 Web Component
2. 在爱速搭应用设置中引入外部 JS/CSS
3. 在页面编辑器中引入 Web Component 组件

下面具体说明每一步的操作

## Angular 组件改造

改造细节请参考[官方文档](https://angular.io/guide/elements)，改造完后的 Angular 组件就能嵌入到任意页面中。

除了编译为 Web Component，在还有个需要注意的地方是 service 的调用，在普通 Angular 项目中数据请求一般是通过 service 实现的，UI 组件不关心，但打包成 Web Component 组件后无法修改内部实现，因此需要将 service 外部接口所需的配置也放在组件属性配置中，比如下面这个组件示例

```javascript
@Component({
  selector: "my-select",
  templateUrl: "./select.component.html",
})
export class SelectComponent {
  users: User[] = [];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.users = this.userService.getItems();
  }
}
```

数据获取接口是通过外部 `UserService`，组件本身并不知道数据是从哪获取的，这个组件打包成 Web Component 后，对外使用时就是下面的形式

```html
<my-select></my-select>
```

内部 api 地址被封装起来了，导致无法更改，也无法使用爱速搭平台的后端代理功能，因此我们需要做如下改造

```javascript
@Component({
  selector: "my-select",
  templateUrl: "./select.component.html",
})
export class SelectComponent {
  @Input() api: string;

  users: User[] = [];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.users = this.http.get(this.api);
  }
}
```

上面改造的要点是将 api 变成组件属性，这时使用组件就能通过如下形式，是的组件可以控制 api 来源

```html
<my-select api="http://xxx"></my-select>
```

改造完成后续需要使用 `npm run build` 打包成 js 文件。

打包完后，需要测试一下页面中放入该组件是否能正常运行，测试页面类似如下

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Elements</title>
  </head>
  <body>
    <my-select></my-select>
    <script src="runtime-es5.3d14b3ad980d82585080.js"></script>
    <script src="polyfills-es5.31618c6906826ad6deb8.js"></script>
    <script src="main-es5.3745a270d0c7c1fecdf6.js"></script>
  </body>
</html>
```

确认没问题后就可以进入下一步了

## 应用引入外部依赖

经过前面的改造和编译后，一般会有如下文件产出（不同版本的 Angular 可能会有区别）：

```
3rdpartylicenses.txt
favicon.ico
index.html
main-es2017.1a27f1fc3b52e01f2273.js
main-es5.1a27f1fc3b52e01f2273.js
polyfills-es2017.79d8baa3acf5316d4e1a.js
polyfills-es5.31618c6906826ad6deb8.js
runtime-es2017.3d14b3ad980d82585080.js
runtime-es5.3d14b3ad980d82585080.js
styles.5abc20b315a4b266fdb5.css
```

其中我们只需要 es5 相关的 `runtime-es5.xx.js` `polyfills-es5.xx.js` 和 `main-es5.xx.js`。

将这几个文件上传到用户浏览器可以访问的 CDN 上。

进入「应用设置」-「外链 JS/CSS」中，将这前面上传的文件地址添加进来，如图所示

![image.png](/img/页面设计/普通页面设计/angular/external-js-css.png)

添加完后需要刷新页面才会生效。

## 在页面编辑器中引入 Web Component

进入页面编辑器，在左侧组件列表中找到「Web Component」，添加到页面中，通过右侧属性面板修改它的标签及属性。

![image.png](/img/页面设计/普通页面设计/angular/editor-web-component.png)

这样就完成了 Angular 组件在页面中的显示。
