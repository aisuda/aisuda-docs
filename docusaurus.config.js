const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: '爱速搭',
  tagline: '爱速搭文档',
  url: 'https://baidu.gitee.io/',
  baseUrl: '/aisuda-docs/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/img/favicon.png',
  organizationName: 'aisuda', // Usually your GitHub org/user name.
  projectName: 'aisuda-docs', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: '爱速搭',
      logo: {
        alt: 'Logo',
        src: '/img/logo.png'
      },
      items: [
        {
          type: 'doc',
          docId: '产品描述/简介',
          position: 'left',
          label: '使用手册'
        },
        {
          type: 'doc',
          docId: '快速入门/使用流程',
          position: 'left',
          label: '快速入门'
        },
        {
          type: 'doc',
          docId: '私有部署/私有部署安装',
          position: 'left',
          label: '私有部署'
        },
        {
          type: 'doc',
          docId: 'OpenAPI/介绍',
          position: 'left',
          label: 'OpenAPI'
        },
        {
          href: 'https://aisuda.bce.baidu.com/',
          label: '爱速搭官网',
          position: 'right'
        },
        {
          href: 'https://baidu.gitee.io/amis',
          label: 'amis 官网',
          position: 'right'
        }
      ]
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/aisuda/aisuda-docs/edit/main/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexDocs: true,
        indexPages: true,
        hashed: true,
        language: ['zh']
      }
    ]
  ]
};
