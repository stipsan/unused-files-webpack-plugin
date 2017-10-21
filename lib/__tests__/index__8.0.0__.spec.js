"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

var _path = _interopRequireDefault(require("path"));

var _memoryFs = _interopRequireDefault(require("memory-fs"));

var _webpack = _interopRequireDefault(require("webpack"));

var _index = _interopRequireDefault(require("../index"));

const EXPECTED_FILENAME_LIST = [
  `CHANGELOG.md`,
  `README.md`,
  `src/__tests__/index.spec.js`,
  `package.json`
];
describe(`UnusedFilesWebpackPlugin module`, () => {
  it(`should work as expected`, done => {
    const compiler = (0, _webpack.default)({
      context: _path.default.resolve(__dirname, `../../`),
      entry: {
        UnusedFilesWebpackPlugin: _path.default.resolve(
          __dirname,
          `../index.js`
        )
      },
      output: {
        path: __dirname // It will be in MemoryFS :)
      },
      plugins: [new _index.default()]
    });
    compiler.outputFileSystem = new _memoryFs.default();
    compiler.run((err, stats) => {
      expect(err).toBeFalsy();
      const { warnings } = stats.compilation;
      expect(warnings).toHaveLength(1);
      const [unusedFilesError] = warnings;
      expect(unusedFilesError).toBeInstanceOf(Error);
      const { message } = unusedFilesError;
      const containsExpected = EXPECTED_FILENAME_LIST.every(filename =>
        message.match(filename)
      );
      expect(containsExpected).toBeTruthy();
      done();
    });
  });
});