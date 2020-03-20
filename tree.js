const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const assert = require('assert');

const FileType = {
  BLOCK_DEVICE: 'b',
  CHARACTER_DEVICE: 'c',
  DIRECTORY: 'd',
  FIFO: 'p',
  FILE: '-',
  SOCKET: 's',
  SYMBOL_LINK: 'l',
  UNKNOWN: 'x'
};

class Tree {
  /**
   * @constructor
   * @param {object} options
   * @param {string} options.targetDir 目标 dir
   * @param {boolean} options.type 是否展示文件类型
   * @param {boolean} options.absolute 是否展示文件绝对路径
   * @param {boolean} options.showInfo 是否展示文件详细信息
   */
  constructor(options) {
    this.targetDir = options.targetDir;
    this.showFileType = options.type;
    // this.showAbsolutePath = options.absolute;
    // this.showInfo = options.info;
  }

  buildPathStr(fd, index, styleStr = '') {
    let pathStr = '';
    let filename = fd.name;
    if (this.showFileType) {
      filename = ` ${chalk.red(Tree.getFdType(fd))} ${filename}`;
    }

    pathStr = index === 0 ? `|-${filename}` : `${' '.repeat(index)}|-${filename}`;
    if (styleStr) {
      const styleList = styleStr.split(' ');
      assert(styleList.every(item => typeof chalk[item] === 'function'));

      return styleList.reduce((target, item) => target[item], chalk)(pathStr);
    }
    return pathStr;
  }

  static getFdType(fd) {
    if (fd.isBlockDevice()) return FileType.BLOCK_DEVICE;
    if (fd.isCharacterDevice()) return FileType.CHARACTER_DEVICE;
    if (fd.isDirectory()) return FileType.DIRECTORY;
    if (fd.isFIFO()) return FileType.FIFO;
    if (fd.isFile()) return FileType.FILE;
    if (fd.isSocket()) return FileType.SOCKET;
    if (fd.isSymbolicLink()) return FileType.SYMBOL_LINK;
    return FileType.UNKNOWN;
  }

  async traverse(dir = this.targetDir, index = 0) {
    try {
      const fds = await fs.readdir(dir, { withFileTypes: true });
      if (fds.length === 0) return;

      for await (const fd of fds) {
        if (fd.isDirectory()) {
          console.log(this.buildPathStr(fd, index, 'cyan'));
          const nextDir = path.join(dir, fd.name);
          await this.traverse(nextDir, index + 1);
        } else {
          console.log(this.buildPathStr(fd, index));
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  }
}

module.exports = Tree;
