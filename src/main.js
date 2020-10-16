// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from './store'
import ViewUI from 'view-design'
import config from '@/config'
// import { directive as clickOutside } from 'v-click-outside-x'
import { Descriptions, Row, Col, Tabs, Radio, Modal, PageHeader } from 'ant-design-vue'
import currency from '../src/libs/currency' // 过滤器，过滤数字
import downloadImg from '../src/libs/downloadImg' // 过滤器，过滤数字
import './index.less'
import '@/assets/icons/iconfont.css'
import { getShowState } from '@/libs/util.js'
import 'mavon-editor/dist/css/index.css'
Vue.use(ViewUI, {
  // 全局配置
  transfer: true // 所有带浮层的组件，是否将浮层放置在 body 内
})

// Vue.use(Antd)
// 按需引入antv的组件
Vue.use(Descriptions)
Vue.use(Tabs)
Vue.use(Row)
Vue.use(Col)
Vue.use(Radio)
Vue.use(PageHeader)
Vue.use(Modal)

/**
* @description 生产环境关掉提示
*/
Vue.config.productionTip = false
/**
* @description 全局注册应用配置
*/
Vue.prototype.$config = config
/**
     * 注册指令
     */
// importDirective(Vue)
// Vue.directive('clickOutside', clickOutside)
// 过滤器，货币过滤
Vue.filter('currency', currency)

Vue.prototype.downloadImg = downloadImg
Vue.prototype.getShowState = getShowState // 控制显示

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
