const { defineConfig } = require('@vue/cli-service')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// unplugin-auto-import 可以不用每个页面引入vue的方法，能直接使用
// const AutoImportPlugin = require('unplugin-auto-import/webpack')
module.exports = defineConfig({
  lintOnSave:false, //禁用eslint
  transpileDependencies: true,
  publicPath: "./",
  outputDir: "docs",
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugin('uglifyjs-plugin')
        .use('uglifyjs-webpack-plugin', [{
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']
            }
          }
        }])
    // config.plugin('unplugin-auto-import').use(
    //     AutoImportPlugin({
    //       imports:['vue','vuex','vue-router','vant'],
    //       dts:'./auto-imports.d.ts'
    //     }),
    // )
  },
  devServer: {
    port: 8010
  }
})
