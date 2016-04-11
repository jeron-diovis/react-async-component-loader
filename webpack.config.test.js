require("es6-promise").polyfill();
var ctx = require.context("./test", true, /\.js$/);
ctx.keys().forEach(ctx);
