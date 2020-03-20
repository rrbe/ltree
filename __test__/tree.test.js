const path = require('path');
const chalk = require('chalk');
const Tree = require('../tree');

let logSpy;

beforeAll(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(msg => msg);
});

afterEach(() => {
  logSpy.mockClear();
});

afterAll(() => {
  logSpy.mockRestore();
});

test('should output error when dir not exist', async () => {
  const tree = new Tree({});
  await tree.traverse('fakeDir');

  expect(logSpy).toHaveReturnedWith("ENOENT: no such file or directory, scandir 'fakeDir'");
});

test('should output current paths when no dir specified', async () => {
  const tree = new Tree({});
  await tree.traverse(path.join(__dirname, 'fixtures'));

  expect(logSpy).toBeCalledTimes(4);
  expect(logSpy).nthReturnedWith(1, chalk.cyan('|-bar'));
  expect(logSpy).nthReturnedWith(2, ' |-bar.js');
  expect(logSpy).nthReturnedWith(3, '|-foo.js');
  expect(logSpy).nthReturnedWith(4, '|-foo.link.js');
});
