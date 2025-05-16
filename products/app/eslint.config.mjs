import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  eslint.configs.recommended,
  {
    root: true,
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier/skip-formatting'
    ],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-text-v-html-on-component': ['error', { allow: ['Scrollable'] }]
    },
    parserOptions: {
      ecmaVersion: 'latest'
    }
  }
])
