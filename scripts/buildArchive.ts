import util = require('util');
import path = require('path');
import fs = require('fs');
import glob = require('glob');
import marked = require('marked');
import JSZip = require('jszip');
import yaml = require('js-yaml');

const globP = util.promisify(glob);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const fileExists = util.promisify(fs.exists);
const ROOT_DIR = path.dirname(__dirname);
let rImage = /\!\[[^\[\]]*\]\(([^\(\)]+)\)/g;

type ITree<T> = T & {
  children?: Array<T>;
};

interface PageNode {
  filepath?: string;
  order?: number;
  title: string;
  description?: string;
  group?: string;
  menuName?: string;
  icon?: string;
  contents?: string;
  attachements?: Array<{
    filepath: string;
    body: Buffer;
  }>;
}

main()
  .then(() => console.log('Done!'))
  .catch(e => console.error(e));

async function main() {
  const files = await collectMDFiles();
  const tree = await buildTree(files);
  await loadTree(tree);
  await archive(tree);
}

async function collectMDFiles() {
  const files = await globP('**/*.md', {
    root: ROOT_DIR,
    ignore: ['node_modules/**/*']
  });

  return files.filter(item => !/^readme\.md$/i.test(item));
}

async function buildTree(filepaths: Array<string>): Promise<ITree<PageNode>> {
  const tree: ITree<PageNode> = {
    title: 'ROOT'
  };
  filepaths = filepaths.concat();

  const sitemapIndex = filepaths.findIndex(item => item === '_sidebar.md');

  if (!~sitemapIndex) {
    throw new Error('_sidebar.md 文件不存在');
  }

  const [sitemapFilename] = filepaths.splice(sitemapIndex, 1);
  const sitemapContent = await readFile(
    path.join(ROOT_DIR, sitemapFilename),
    'utf8'
  );

  const tokens = marked.lexer(sitemapContent);

  if (!tokens.length) {
    throw new Error('_sidebar.md 文件格式错误');
  }

  const list = tokens.find((item: any) => item.type === 'list');
  if (!list) {
    throw new Error('_sidebar.md 没有导航信息');
  }

  await _buildTree(tree, list);

  return tree;
}

async function _buildTree(tree: ITree<PageNode>, token: any) {
  if (token.type === 'list') {
    tree.children = tree.children || [];

    for (let listItem of token.items) {
      const node: ITree<PageNode> = {
        title: ''
      };
      await _buildTree(node, listItem);
      tree.children.push(node);
    }
  } else if (token.type === 'list_item') {
    for (let listItem of token.tokens) {
      await _buildTree(tree, listItem);
    }
  } else if (token.type === 'text') {
    if (token.tokens[0].type === 'link') {
      const link = token.tokens[0];
      tree.title = link.text;

      if (/\.md$/.test(link.href)) {
        tree.filepath = decodeURIComponent(link.href);
      }
    } else {
      tree.title = token.text;
    }
  }
}

async function loadTree(tree: ITree<PageNode>): Promise<ITree<PageNode>> {
  // todo 本来这个地方应该返回一个新 tree 的，先暂时直接改好了

  if (tree.filepath) {
    let contents = await readFile(path.join(ROOT_DIR, tree.filepath), 'utf8');

    if (/---(?:\n|\r)([\s\S]+?)---(?:\n|\r)/.test(contents)) {
      const yml = RegExp.$1;
      contents = contents.replace(/---(?:\n|\r)([\s\S]+?)---(?:\n|\r)/, '');
      const data: PageNode = yaml.load(yml);

      tree.title = data.title || tree.title;
      tree.description = data.description || tree.description;
      tree.group = data.group || tree.group;
      tree.menuName = data.menuName || tree.menuName;
      tree.icon = data.icon || tree.icon;
      tree.order = data.order || tree.order;
    }

    rImage.lastIndex = 0;

    while (true) {
      const match = rImage.exec(contents);
      if (!match) {
        break;
      }

      const imageFile = match[1];
      if (/^\.*\/*static/.test(imageFile)) {
        const realpath = path.join(path.dirname(tree.filepath), imageFile);
        const exists = await fileExists(path.join(ROOT_DIR, realpath));

        if (exists) {
          tree.attachements = tree.attachements || [];
          tree.attachements.push({
            filepath: realpath,
            body: await readFile(path.join(ROOT_DIR, realpath))
          });
        }
      }
    }

    tree.contents = `---\n${[
      `title: ${tree.title}`,
      `description: ${tree.description}`,
      `group: ${tree.group}`,
      `menuName: ${tree.menuName}`,
      `icon: ${tree.icon}`,
      `order: ${tree.order}`
    ].join('\n')}\n---\n${contents}`;
  }

  if (Array.isArray(tree.children)) {
    for (let item of tree.children) {
      await loadTree(item);
    }
  }

  return tree as any;
}

async function archive(tree: ITree<PageNode>) {
  const zip = new JSZip();
  const pool: Array<ITree<PageNode>> = tree.children.concat();

  while (pool.length) {
    const item = pool.shift()!;

    if (Array.isArray(item.children)) {
      pool.push(...item.children);
    }

    if (item.contents) {
      zip.file(item.filepath, item.contents);
    }

    if (Array.isArray(item.attachements)) {
      item.attachements.forEach(attachemt => {
        zip.file(attachemt.filepath, attachemt.body);
      });
    }
  }

  const body = await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9
    }
  });

  await writeFile(path.join(ROOT_DIR, 'docs.zip'), body);
  console.log(`打包完成 > docs.zip`);
}
