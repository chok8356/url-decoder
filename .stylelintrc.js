const vue = {
  files: ["**/*.vue"],
  customSyntax: "postcss-html",
}

const scss = {
  files: ["**/*.scss"],
  customSyntax: "postcss-scss",
}

module.exports = {
  plugins: ['stylelint-scss', 'stylelint-order'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended',
  ],
  rules: {
    'order/properties-alphabetical-order': true,
    'at-rule-no-unknown': null,
    'selector-class-pattern': null,
  },
  overrides: [
    vue,
    scss
  ]
};
