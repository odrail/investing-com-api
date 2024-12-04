import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [...compat.extends('eslint:recommended', 'google'), {
  languageOptions: {
    globals: {
      ...globals.commonjs,
      ...globals.node,
      ...globals.jest,
    },

    ecmaVersion: 12,
    sourceType: 'module',
  },

  rules: {
    'max-len': ['error', 120],
    'object-curly-spacing': ['error', 'always'],
    'space-infix-ops': 'error',
  },
},
...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
),
];
