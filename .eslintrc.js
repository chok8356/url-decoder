const rules = {
  'import/order': ['error', {
    alphabetize: {
      order: 'asc',
      caseInsensitive: true,
    },
  }],
  'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
};

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  rules,
  overrides: [
    // Ts
    {
      files: '**/*.ts',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
      },
      plugins: [
        '@typescript-eslint',
      ],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'airbnb-typescript/base',
      ],
      rules,
    },
    // Vue
    {
      files: '**/*.vue',
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      extends: [
        'plugin:vue/vue3-recommended',
      ],
      rules: {
        ...rules,
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/html-closing-bracket-newline': ['error', {
          singleline: 'never',
          multiline: 'never',
        }],
        'vue/html-closing-bracket-spacing': ['error', {
          startTag: 'never',
          endTag: 'never',
          selfClosingTag: 'always',
        }],
        'vue/max-attributes-per-line': ['error', {
          singleline: {
            max: 1,
          },
          multiline: {
            max: 1,
          },
        }],
        'vue/attributes-order': ['error', {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'SLOT',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: true,
        }],
      },
    },
  ],
};
