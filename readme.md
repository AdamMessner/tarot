# @intouchg/tarot

Easy custom Webpack configs for SCSS and JS

## Features

* babel-loader
* webpack-bundle-analyzer
* CSS / SCSS entry files
* SCSS with PostCSS autoprefixer and media query sorting
* SCSS $env variable based on Webpack mode

## Usage

1. Set up your `webpack.config.js` using tarot:
```js
// webpack.config.js
const { build } = require('@intouchg/tarot')

module.exports = build({
	// Entry keys are used as the filename of the bundled output,
	// with appropriate file extension automatically added, and
	// are relative to the output directory.
	// Entry values are used as the filepath of the entry file,
	// and are relative to the source directory.
	entries: {
		bundle: 'index.js',
		styles: 'index.scss',
		['js/bundle-' + new Date().toISOString()]: 'index.js',
	},

	// Options
	source: 'src2', // Source directory, default 'src'
	output: 'dist2', // Output directory, default 'dist'
	https: true, // Enable HTTPS, default false
	cors: true, // Enable CORS, default false
	copy: [ // Copy static assets, default []
		{
			from: 'assets', // Relative to the source directory
			to: 'other' // Relative to the output directory
		}
	],

	// Note: Webpack `context` is assumed to be process.cwd()
})
```

2. Use `webpack-cli` and arguments to build:
```sh
webpack serve
webpack --mode development
webpack --analyze
```

## Prior Art

* [tarot](https://github.com/codynova/tarot)