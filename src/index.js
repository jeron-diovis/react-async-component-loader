import lutils from "loader-utils"
import sysPath from "path"

export default function loader() {}

loader.pitch = function(remainingRequest, precedingRequest) {
  const tplPath = sysPath.join(__dirname, "AsyncComponent.js")
  this.addDependency(tplPath)
  this.cacheable()

  // ---

  const options = this.options.asyncComponentLoader || {}
  const query = lutils.parseQuery(this.query)
  const opts = Object.assign({}, options.defaults, query)

  // ---

  const bundleQs = "lazy" + (!opts.name ? "" : `&name=${opts.name}`)

  let strLoaderImport = ""
  let strLoaderProp = ""
  if (opts.loader) {
    strLoaderImport = `var Loader = require(${lutils.stringifyRequest(this, opts.loader)})`
    strLoaderProp = "Loader: Loader,"
  }

  // ---

  // Concat preceding and remaining request, and prepend bundle-loader.
  // In this way we make sure that this loader does not depend from it's position in loaders chain and always will be the last.
  // It means "let all other loaders to process requested module as they want, then I will just load their result asynchronously".
  //
  // It's very important for convenient usage, because otherwise you'd need to manually maintain proper loaders order.
  // For example, if you process all your JS with { test: /\.js$/, loaders: [ "react-hot", "babel" ] },
  // you'd need to always put config for react-async-component loader *before* that one.
  //
  // With this approach, just add config for react-async-component loader wherever you want, and enjoy.
  const request = [ `bundle-loader?${bundleQs}`, precedingRequest, remainingRequest ].filter(x => x).join("!")

  return `
    var React = require('react');
    var loadComponent = require(${lutils.stringifyRequest(this, `!!${request}`)});
    var Component = require(${lutils.stringifyRequest(this, tplPath)});
    ${strLoaderImport}
    module.exports = function AsyncComponentDefaults(props) {
      return React.createElement(Component, Object.assign({}, props, {
        loadComponent: loadComponent,
        ${strLoaderProp}
      }));
    }
  `
}
