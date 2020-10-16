/* eslint-disable*/
const path = require('path')
const compressionPlugin = require('compression-webpack-plugin')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production' ?
  '/dsgame' :
  '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_cp', resolve('src/components/public'))
      .set('_cb', resolve('src/components/business'))
      .set('_apiPub', resolve('src/api/public'));

    //全局less变量
    const oneOfsMap = config.module.rule('less').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Provide path to the file with resources
          resources: 'src/global.less',
        })
        .end()
    })

    // 为了补删除换行而加的配置
    config.module
    .rule('vue')
    .use('vue-loader')
    .loader('vue-loader')
    .tap(options => {
        options.compilerOptions.whitespace = '';
        options.compilerOptions.preserveWhitespace = true;
        return options;
    });

  },

  configureWebpack: config => {
    return {
      plugins: [new compressionPlugin({
        test: /\.js$|\.html$|\.css/, // 匹配文件名
        threshold: 1024 * 100, // 对超过100K的文件进行压缩
        deleteOriginalAssets: false // 是否删除原文件
      })]
    }
  },

  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  //这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  // devServer: {
  //     proxy: 'http://192.168.1.246:8183'
  // }


}
