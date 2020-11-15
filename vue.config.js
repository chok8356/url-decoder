// eslint-disable-next-line @typescript-eslint/no-var-requires
const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/url-decoder/' : '/',
  lintOnSave: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/assets/styles/global.scss";'
      }
    }
  },
  configureWebpack: {
    plugins: [
      new StyleLintPlugin({
        files: ['**/*.{vue,scss}'],
        fix: true,
        quiet: true
      })
    ]
  }
}
