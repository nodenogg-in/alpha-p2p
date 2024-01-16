/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
<<<<<<< HEAD
    'vue/multi-word-component-names': 'off',
    'vue/no-v-text-v-html-on-component': ['error', { allow: ['Scrollable'] }]
=======
    'vue/multi-word-component-names': 'off'
>>>>>>> 251788f (switched to monorepo)
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
