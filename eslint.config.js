import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
    // 1. Use recommended ESLint rules
    js.configs.recommended,

    // 2. Define global variables (so it doesn't complain about 'window' or 'process')
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },

    // 3. Configure Prettier integration
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            // Turn off ESLint rules that conflict with Prettier
            ...prettierConfig.rules,

            // Treat Prettier formatting issues as ESLint errors
            'prettier/prettier': 'error',

            // Your Custom Rules
            'no-console': 'warn',
            'no-unused-vars': 'warn',
            eqeqeq: 'error',
            'prefer-const': 'error',
        },
    },
];
