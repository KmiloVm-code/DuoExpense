import globals from 'globals'
import pluginJs from 'eslint-plugin-js'
import tseslint from '@typescript-eslint/eslint-plugin'
import pluginReact from 'eslint-plugin-react'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
    ...pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginReact.configs.flat.recommended
  }
]
