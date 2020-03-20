#!/usr/bin/env node
const program = require('commander');
const Tree = require('./tree');

/**
 * @param {Array<String>} args
 */
function validateDefaultArgs(args) {
  if (args.length === 0) {
    return process.cwd();
  }
  if (args.length > 1) {
    throw new Error('Error: only supports single directory');
  }
  return args[0];
}

program.version('1.0.0');

program
  .option('-i, --info', 'show file info')
  .option('-a, --absolute', 'show absolute path')
  .option('-t, --type', 'show file type');

program.action(() => {
  const targetDir = validateDefaultArgs(program.args);
  const tree = new Tree({
    targetDir,
    ...program.opts()
  });
  try {
    tree.traverse();
  } catch (e) {
    console.log(e.message);
  }
});

program.parse(process.argv);
