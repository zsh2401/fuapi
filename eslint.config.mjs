// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// import {} from "@/"
export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    globalIgnores(['cjs/*', 'es/*']),
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            // '@typescript-eslint/no-floating-promises': 'error',
            // '@typescript-eslint/explicit-function-return-type':
            //   'error',
            'require-await': 'warn',
            semi: 'off',
        },
    }
)
