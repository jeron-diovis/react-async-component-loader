# react-async-component-loader
Webpack loader to lazy load your components, wrapping them into preloader component

Inspired by https://github.com/lavrton/Progressive-Web-App-Loading

### Installation
```
npm install --save-dev react-async-component-loader
```

### Basic usage
```js
// HomePage.js

import HugeHeavyComponent from "react-async-component!./HugeHeavyComponent.js"

...

<HomePage>
  <HugeHeavyComponent />
</HomePage>
```

# What it actually does?
It loads target module via [bundle-loader](https://github.com/webpack/bundle-loader) with `lazy` option.
The resulting chunk loader function is passed to a special component, which will call that function when mounted. And while chunk is loading, it will render a progress indicator of your choice.

# Query parameters
### name: String

It is passed directly to [bundle-loader](https://github.com/webpack/bundle-loader). Defines chunk name for your async module. Use it to group modules.

If not specified, each module goes to own chunk.

**Example:**

```js
import MyComponent from "react-async-component?name=my-chunk!./MyComponent.js"
```

### loader: String

Path to module, containing your preloader indicator component. 

If not specified, just a div with "Loading" text will be rendered.

Path is resolved in exactly same way as any other module in project, i.e., depending on your webpack config.  Which means, you can refer either your custom component or some package from `node_modules` – for example, use [react-loader](https://github.com/TheCognizantFoundry/react-loader).

**Example:**

```js
import MyComponent from "react-async-component?loader=./components/MySuperLoader!./MyComponent.js"

import MyComponent from "react-async-component?loader=react-loader!./MyComponent.js"
```

**NOTE:** On practice, unlikely you will use this inline option, as it's looks quite bad and hard to read. Also, unlikely you will ever have different preloaders for different modules, so you may want to once define a default preloader and forget about it. See how to do this below. 

# Global defaults

It is possible to define default options directly in webpack config.
For this, add `asyncComponentLoader` section:

```js
// webpack.config.js
module.exports = {
    asyncComponentLoader: {
        defaults: {
            loader: String, 

            // Note, that by defining this, you will put all async modules 
            // with no explicit name specified to the same chunk
            name: String, 
        },
    },
}
```

On my view, this section should be used to define default preloader component, and [`module.loaders`](https://webpack.github.io/docs/using-loaders.html#configuration) section should be used to define `name` parameter for specific modules.

**Example:**

```js
// webpack.config.js
module.exports = {
	module: {
		loaders: [
			{
				test: /\/containers\/Profile/,
				loader: "react-async-component",
				query: {
					name: "Profile",
				},
			},
			{
				test: /\/containers\/Inbox/,
				loader: "react-async-component",
				query: {
					name: "Inbox",
				},
			},
		],
	},

    asyncComponentLoader: {
        defaults: {
            loader: "react-loader", 
        },
    },
}
```

# Caveats
You can't put same module in two different chunks, importing it with different `name` option. Webpack knows that it's the same module, and the first chunk name it met will be used in all other cases.
I.e., with code like this:
```js
// file1.js
import Component from "react-async-component?name=Foo!./Component";

// file2.js
import Component from "react-async-component?name=Bar!./Component";

// main.js
import "file1"
import "file2"
```
only `Foo` chunk will be created, and both file1 and file2 will refer to it.

Same for `name`, defined in `module.loaders`: inline option will override it.