# 爱速搭使用手册

## 文档编写

### 安装文档编译

文档使用 [Asciidoctor](https://docs.asciidoctor.org/asciidoctor/latest/) 编译，可以通过 `brew install asciidoctor` 安装，或者下面的方式

首先编辑 `~/.gemrc` 文件，内容是

```
---
:backtrace: false
:bulk_threshold: 1000
:sources:
- https://gems.ruby-china.com/
:update_sources: true
:verbose: true
```

然后运行 `gem install asciidoctor`，gem 的方式可以方便装其他扩展，比如 asciidoctor-pdf

### 文档编译

```
asciidoctor --backend=html5 -a webfonts! index.adoc
```

生成的 index.html 文件就是编译结果。

平时编辑文档时候可以通过 VS Code 安装 Asciidoctor 扩展来预览，但目前有个问题，那就是子目录下的文档图片链接不对，导致预览效果打折扣，目前还没找到解决办法。

## 文档开发

自定义主题参考[这里](https://github.com/asciidoctor/asciidoctor-pdf/blob/v1.6.x/docs/theming-guide.adoc)
