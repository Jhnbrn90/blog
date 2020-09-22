module.exports = {
    'env': {
        'browser': true,
        'node': true,
        'es2021': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true,
        },
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'plugins': [
        'react',
        '@typescript-eslint',
    ],
    'settings': {
        'react': {
            'version': 'detect',
        },
    },
    'rules': {
        'no-console': 'off',
        'comma-dangle': [
            'error',
            {
                'arrays': 'always-multiline',
                'objects': 'always-multiline',
                'imports': 'always-multiline',
                'exports': 'always-multiline',
                'functions': 'never',
            },
        ],
        'indent': [
            'error',
            4,
            {
                'SwitchCase': 1,
            },
        ],
        'linebreak-style': ['error', 'unix'],
        'quotes': [
            'error',
            'single',
            {
                'avoidEscape': true,
            },
        ],
        'react/prop-types': 0,
        'semi': ['error', 'always'],
    },
};
