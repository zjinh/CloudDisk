module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/essential'],
	rules: {
		'no-console': 'off',
		'no-debugger': 'off',
		'no-duplicate-case': 2,
		eqeqeq: [2, 'allow-null'],
		'eol-last': ['error', 'always']
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
};
