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
        'simple-import-sort',
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
        'simple-import-sort/sort': [
            'error',
            {
                'groups': [
                // React
                    ['^(react|react-dom)$'],
                    // other packages. Node packages first
                    [
                        '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
                        '^@?\\w',
                    ],
                    // Shared modules
                    ['^/\\.\\./shared(/.*|$)'],
                    // Wrong imports (should be replaced)
                    ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                    // Internal packages, parent imports, other relative imports
                    ['^/(components|hooks|helpers|services|images|pages|style|store|classes)(/.*|$)'],
                    // Sub components of current component
                    ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                    // Internal packages, parent imports, other relative imports
                    ['^/(svg|images|style)(/.*|$)'],
                ],
            },
        ],
    },
};
