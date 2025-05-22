import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import vuePlugin from 'eslint-plugin-vue'

export default tseslint.config([
  eslint.configs.recommended,
  {
    root: true,
    plugins: {
      vue: vuePlugin
    },
    languageOptions: {
      ecmaVersion: 'latest',
      parser: vuePlugin.parser
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-text-v-html-on-component': ['error', { allow: ['Scrollable'] }],
      'vue/comment-directive': 'error',
      'vue/jsx-uses-vars': 'error'
    }
  }
])
