---
id: 开发amis组件扩展包
---

### amis组件扩展包工作流程图
![image](/img/NPM组件扩展包/amis-npm-widget/amis-npm-widget-work.png)

### 如何开发一个 amis组件扩展包

#### 1、需要准备的环境
node（推荐 v17.4.0，或更新版本）  
npm（推荐 8.3.1，或更新版本）

#### 2、需要使用到的NPM包
[amis-widget-cli](https://github.com/aisuda/amis-widget-cli)（自定义组件开发工具）  
[amis-widget](https://github.com/aisuda/amis-widget)（amis-editor自定义组件注册器，支持react和vue2.0技术栈，用于注册自定义渲染器和插件）

#### 3、开发amis组件扩展包关键步骤
##### 步骤1：全局安装 amis-widget-cli
amis-widget-cli  
yarn global add amis-widget-cli 或者  npm i -g amis-widget-cli  

##### 步骤2：创建一个NPM组件扩展包  
amis init -e=amis -m=copy  或  amis init --editor=amis --mode=copy

目前已提供7种自定义组件类型：

![image](/img/NPM组件扩展包/amis-npm-widget/install-amis-widget-cli-amis.png)

比如准备使用vue2.0开发一个amis 组件扩展包（amis自定义组件），可选择 vue自定义组件，输入组件扩展包名称后，即可得到如下结构的初始项目：

![image](/img/NPM组件扩展包/amis-npm-widget/vue-custom-widget-template.png)

备注：自定义组件目录说明请见 [vue-custom-widget-template#目录说明](https://github.com/aisuda/vue-custom-widget-template#%E7%9B%AE%E5%BD%95%E8%AF%B4%E6%98%8E)

##### 步骤3：开发一个自定义组件

使用vue2.0开发amis自定义组件，请查看vue2.0官方使用文档（vue语法）：https://v2.cn.vuejs.org/v2/guide/index.html。

![image](/img/NPM组件扩展包/amis-npm-widget/vue-custom-widget-template-code.png)

##### 步骤4：注册为一个爱速搭可用的amis自定义组件  

使用 amis-widget 中的 registerRendererByType 方法注册为爱速搭可识别的自定义组件：  
```
// 注册自定义组件（amis-editor渲染器需要）
import InfoCard from './widget/info-card';
import { registerRendererByType } from 'amis-widget';

/* 引入公共的静态资源 */
import '$public/css/base.css';

registerRendererByType(InfoCard, {
  type: 'vue-info-card',
  usage: 'renderer',
  weight: 99,
  framework: 'vue',
});
```

##### 步骤5：为amis自定义组件设置基本属性和可配置项  
使用 amis-widget 中的 registerAmisEditorPlugin 方法为自定义组件设置基本属性和可配置项，编辑器左侧组件面板会按照基本属性中的分类和排序展示自定义组件。

其中 scaffold 中的数据会作为自定义组件初次添加到页面中的默认数据，panelControls 中的数据则会用于生产自定义组件的可配置项（右侧属性配置面板）。

```
import { registerAmisEditorPlugin } from 'amis-widget';

export class InfoCardPlugin {
  rendererName = 'vue-info-card';
  $schema = '/schemas/UnkownSchema.json';
  name = 'vue-info-card';
  description = '信息展示卡片';
  tags = ['展示', '自定义'];
  icon = 'fa fa-file-code-o';
  scaffold = {
    type: 'vue-info-card',
    label: 'vue-info-card',
    name: 'vue-info-card',
  };
  previewSchema = {
    type: 'vue-info-card',
    label: 'vue-info-card',
  };

  panelTitle = '配置';

  panelControls = [
    {
      type: 'textarea',
      name: 'title',
      label: '卡片title',
      value:
        'amis 是一个低代码前端框架，它使用 JSON 配置来生成页面，可以减少页面开发工作量，极大提升效率。',
    },
    {
      type: 'text',
      name: 'backgroundImage',
      label: '展示图片',
      value:
        'https://search-operate.cdn.bcebos.com/64c279f23794a831f9a8e7a4e0b722dd.jpg',
    },
    {
      type: 'input-number',
      name: 'img_count',
      label: '图片数量',
      value: 3,
    },
    {
      type: 'input-number',
      name: 'comment_count',
      label: '评论数',
      value: 2021,
    },
  ];
}

registerAmisEditorPlugin(InfoCardPlugin, {
  rendererName: 'vue-info-card',
  name: 'vue-info-card',
});

export default InfoCardPlugin;
```

##### 步骤6：本地预览自定义组件内容  
控制台输入：npm run preview 后，会自动打开浏览器，预览自定义组件内容。

备注：  
1、本地预览自定义组件前，请确认已执行过 npm install （确保构建需要的依赖已经安装）；  
2、src/preview.js 中添加和使用当前开发中的自定义组件。  

##### 步骤7：在爱速搭中调试自定义组件
> 可用于检验爱速搭页面编辑器（amis编辑器）是否能正常使用当前自定义组件

控制台输入：npm run linkDebug 后，复制控制台输出的脚本地址：
![image](/img/NPM组件扩展包/amis-npm-widget/linkDebug.png)

添加到爱速搭/临时外链中：
![image](/img/NPM组件扩展包/amis-npm-widget/linkDebug2.png)

在编辑器端使用和调试自定组件：
![image](/img/NPM组件扩展包/amis-npm-widget/linkDebug-editor.png)

##### 步骤8：发布自定义组件  
1、发布前请先构建自定义组件输出文件，执行：npm run build2lib。  

备注：构建文件默认存放在dist目录下。  

2、package.json中添加自定义组件信息，导入爱速搭中会读取这里的信息（amis-widgets）：  

![image](/img/NPM组件扩展包/amis-npm-widget/vue-custom-widget-package.png)

#### 4、发布到npm仓库中：npm publish
![image](/img/NPM组件扩展包/amis-npm-widget/npm-publish.png)


