import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error'
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended
])
