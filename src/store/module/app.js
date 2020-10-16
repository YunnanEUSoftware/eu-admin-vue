import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled
} from '@/libs/util'
import beforeClose from '@/router/before-close'
import router from '@/router'
// import routers from '@/router/routers'
import config from '@/config'
// TODO
// import {
//   postGetNavigation // 获取路由
// } from '@/api/routers'
import permissionsRouter from '../../router/permissions-router'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    hasReadErrorPage: false,
    menuRspList: [],

    currentRouteName: ''
  },
  getters: {
    // menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
    menuList: (state, getters, rootState) => getMenuByRouter(state.menuRspList, rootState.user.access)
  },
  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    },
    setMenuRspList (state, { routerList, isReflash }) {
      if (isReflash) { state.menuRspList = [] }
      // 不重复添加路由 否则会抛出异常
      if (state.menuRspList.length === 0 || isReflash) {
        state.menuRspList.push(...routerList)
        router.addRoutes(routerList)
      }
    },
    setCurrentRouteName (state, name) {
      state.currentRouteName = name
    }
  },
  actions: {
    async getMenuData ({
      commit,
      rootState
    }, isReflash = false) {
      // 如果有路由就直接返回
      if (rootState.app.menuRspList.length > 0 && !isReflash) { return }

      // TODO 登录---------------------
      let success = true
      let data = [
        { powerPageTitle: '部门管理', powerPagePath: 'departmentManage' },
        { powerPageTitle: '员工管理', powerPagePath: 'staffManage' },
        { powerPageTitle: '角色管理', powerPagePath: 'roleManage' },
        { powerPageTitle: '权限管理', powerPagePath: 'powerManage' },
        { powerPageTitle: '界面配置', powerPagePath: 'powerPageConfig' }
      ]
      // TODO 登录---------------------

      // TODO 取消注释
      // const { success, data } = await postGetNavigation()
      if (success) {
        if (data && data.length === 0) {
          const portalUrl = process.env.VUE_APP_PORTAL_URL
          sessionStorage.clear()
          window.location.replace(portalUrl + '/login')
        }
        let canShowRoute = data.map(item => item.powerPagePath)
        let routerList = []
        for (let fatherIndex in permissionsRouter) {
          let childRoute = permissionsRouter[fatherIndex].children
          let result = childRoute.filter(item => {
            return canShowRoute.indexOf(item.name) !== -1
          })
          if (result.length > 0) {
            routerList.push({
              ...permissionsRouter[fatherIndex],
              children: result
            })
          }
        }
        // 按照接口返回排序
        // routerList.sort((itemA, itemB) => {
        //   return canShowRoute.indexOf(itemA.children[0].name) - canShowRoute.indexOf(itemB.children[0].name)
        // })

        // 错误页面
        let errorPage = {
          redirect: '/404',
          path: '*',
          meta: { hideInMenu: true },
          component: () => import('@/view/error-page/404.vue')
        }
        routerList.push(errorPage)
        // 添加路由
        commit('setMenuRspList', { routerList, isReflash })
      }
    }
  }
}
