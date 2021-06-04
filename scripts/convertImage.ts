/**
 * 用来将 md 里面的远程地址转成内部地址
 */
import glob = require('glob');
import util = require('util');
import path = require('path');
import fs = require('fs');
import axios from 'axios';

const globP = util.promisify(glob);

main()
  .then(() => console.log('Done!'))
  .catch(e => console.error(e));

async function main() {
  const rootDir = path.dirname(__dirname);
  const imgDir = path.join(rootDir, 'staic/img');

  const files = await globP('**/*.md', {
    root: rootDir,
    ignore: ['node_modules/**/*']
  });

  let r = /\!\[[^\[\]]*\]\(([^\(\)]+)\)/g;
  for (let filepath of files) {
    const realpath = path.join(rootDir, filepath);
    let contents = fs.readFileSync(realpath).toString();
    r.lastIndex = 0;

    const toReplace: Array<{
      start: number;
      end: number;
      replaceWith: string;
    }> = [];

    while (true) {
      const match = r.exec(contents);
      if (!match) {
        break;
      }

      const [_, uri] = match;

      // 如果是远程地址
      if (/^https?\:\/\//.exec(uri)) {
        const result = await axios.get(uri, {
          responseType: 'arraybuffer',
          headers: {
            referer: `https://aisuda.bce.baidu.com/`
          }
        });
        const imageFileName = path.basename(uri);
        const dir = filepath.replace(/\.md$/, '');
        const imageFilePath = path.join(imgDir, dir, imageFileName);
        const relativePath = path.relative(
          path.dirname(realpath),
          imageFilePath
        );

        await saveFile(imageFilePath, result.data);
        toReplace.push({
          start: match.index,
          end: match.index + _.length,
          replaceWith: _.replace(/\(([^\(\)]+)\)$/, `(${relativePath})`)
        });
      }
    }

    if (toReplace.length) {
      toReplace.reverse().forEach(item => {
        contents =
          contents.substring(0, item.start) +
          item.replaceWith +
          contents.substring(item.end);
      });

      await saveFile(realpath, contents);
      console.log('文件处理完成：', filepath);
    }
  }
}

async function saveFile(filepath: string, data: Buffer | string) {
  const dir = path.dirname(filepath);
  fs.mkdirSync(dir, {
    recursive: true
  });

  fs.writeFileSync(filepath, data);
}
