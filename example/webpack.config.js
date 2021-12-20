const { build } = require('@intouchg/tarot')

module.exports = build({
	entries: {
		bundle: 'index.js',
		styles: 'styles/index.scss'
	},
	copy: [
		{ from: 'assets' }
	],
})