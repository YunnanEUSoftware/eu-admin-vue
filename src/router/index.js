/* eslint-disable*/
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import iView from 'view-design'
import store from '../store'
import {
  setTitle,
  getToken,
  getFromUrl
} from '@/libs/util'
import config from '@/config'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history',
  base: '/cloudElectrification'
})

const LOGIN_PAGE_NAME = 'login'
const portalUrl = process.env.VUE_APP_PORTAL_URL || 'http://dev.chrsaas.eu'

router.beforeEach((to, from, next) => {
  store.commit('setCurrentRouteName', to.name)
  iView.LoadingBar.start()
  // if (to.name === LOGIN_PAGE_NAME) {
  //   next()
  //   return
  // } else {
  //   next()
  // }
  if (to.name === 'login') {
    window.sessionStorage.clear()
  }
  let token = getToken()
  let fromUrl = getFromUrl()

  if (!token) {
    if (to.name !== LOGIN_PAGE_NAME) {
      iView.Message.warning({
        content: '登录过期，请重新登录',
        duration:3.5,
        onClose:()=>{
          if (fromUrl) window.location.replace(fromUrl);
          else window.location.replace(portalUrl);
        }
      })
    } else {
      // 未登录且要跳转的页面不是登录页
      // next({
      //   name: LOGIN_PAGE_NAME // 跳转到登录页
      // });
      next()
    }
  } else if (token && to.name === LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面是登录页
      next({
          name: config.homeName
      }); // 跳转到homeName页
  } else if (token && to.name !== LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面不是登录页
      next();
      return;
  }
})

router.afterEach(to => {
  // 请求路由
  if (to.path !== '/login') {
    store.dispatch('getMenuData').then(res => {})
  }

  // 设置页面标题
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
