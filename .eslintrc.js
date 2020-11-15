module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    '@typescript-eslint/array-type': ['error', {
      default: 'array',
      readonly: 'array'
    }],
    '@typescript-eslint/indent': ['error', 2, {
      SwitchCase: 1
    }],
    '@typescript-eslint/interface-name-prefix': ['error', {
      prefixWithI: 'always'
    }],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/type-annotation-spacing': ['error', {
      after: true
    }],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': ['error', {
      after: true,
      before: false
    }],
    'keyword-spacing': ['error', {
      after: true,
      before: true
    }],
    'max-len': ['error', {
      code: 120
    }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'object-curly-spacing': [2, 'always'],
    'space-before-blocks': [2, 'always'],
    'space-before-function-paren': [2, 'never'],
    'space-in-parens': ['error', 'never'],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/html-closing-bracket-newline': ['error', {
      multiline: 'never',
      singleline: 'never'
    }],
    'vue/html-closing-bracket-spacing': ['error', {
      endTag: 'never',
      selfClosingTag: 'always',
      startTag: 'never'
    }],
    'vue/max-attributes-per-line': ['error', {
      multiline: {
        allowFirstLine: false,
        max: 1
      },
      singleline: 1
    }],
    'vue/script-indent': ['error', 2, {
      switchCase: 1
    }]
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
