# ISUDA 平台文档

爱速搭应用智能搭建平台

## 如何打开文档

只需要在`根目录`开启任意静态文件服务器，比如系统有装 python 就用

    python -m SimpleHTTPServer

如果是 python 3 是

    python3 -m http.server

或者安装 node 的相关服务，比如 `npm -g install static-server`，然后在`根目录`运行 `static-server`

或者 `npm i ` 后 `npm start`。

## 将远程图片转成本地图片

`npm i` 以后执行 `npm run convertImage` 远程图片会被保存在 /static/img 目录。

## 产出成爱速搭文档包

产出爱速搭文档包，可以直接导入到爱速搭私有部署平台。

`npm run archive` 主要，只有写在 \_sidebar.md 中的文档才会被打包。
