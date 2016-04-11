var sysPath = require("path");
var root = __dirname;
var srcRoot = sysPath.join(root, "src");

var webpack = require("webpack");
var WebpackInfoPlugin = require("webpack-info-plugin");
var WebpackErrorNotificationPlugin = require("webpack-error-notification");

var isProd = process.env.NODE_ENV === "production";

module.exports = {
  context: srcRoot,

  entry: "index.js",

  output: {
    path: sysPath.join(root, "dist"),
    filename: "index.js",
    library: "MyPackage",
    libraryTarget: "umd"
  },

  resolve: {
    root: srcRoot
  },

  eslint: {
    failOnError: true,
    failOnWarning: false
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
        test: /\.js$/i,
        include: srcRoot,
        loader: "babel"
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new WebpackInfoPlugin({
      stats: {
        colors: true,
        version: false,
        hash: false,
        timings: false,
        assets: false,
        chunks: false,
        chunkModules: false,
        modules: false
      },
      state: true
    })
  ].concat(
    !isProd ? [
      new WebpackErrorNotificationPlugin()
    ] : [
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.DedupePlugin()
    ]
  ),

  devtool: isProd ? false : "#inline-source-map"
};