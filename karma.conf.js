var sysPath = require("path");
var root = __dirname;
var srcRoot = sysPath.join(root, "src");
var testsRoot = sysPath.join(root, "test");

module.exports = function (config) {
  config.set({
    singleRun: true,
    browsers: [ "PhantomJS" ],
    frameworks: [ "mocha", "chai-sinon" ],
    reporters: [ "mocha" ],
    files: [
      "webpack.config.test.js"
    ],
    preprocessors: {
      "webpack.config.test.js": [ "webpack", "sourcemap" ]
    },
    webpack: {
      devtool: "inline-source-map",
      resolve: {
        root: srcRoot
      },
      module: {
        preLoaders: [
          {
            test: /\.js$/i,
            include: srcRoot,
            loader: "eslint"
          }
        ],

        loaders: [
          {
            test: /\.js$/,
            include: [
              srcRoot,
              testsRoot
            ],
            loader: "babel"
          }
        ]
      },
      eslint: {
        failOnError: true,
        failOnWarning: false
      }
    },
    webpackServer: {
      stats: {
        timings: true,
        warnings: true,
        errors: true,
        errorDetails: true,
        source: false,
        hash: false,
        version: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        publicPath: false
      }
    }
  });
};
