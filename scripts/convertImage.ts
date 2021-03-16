/**
 * 用来将 md 里面的远程地址转成内部地址
 */
import glob = require('glob');
import util = require('util');
import path = require('path');
import fs = require('fs');

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

  for (let filepath of files) {
    const contents = fs.readFileSync(path.join(rootDir, filepath));
  }
}
