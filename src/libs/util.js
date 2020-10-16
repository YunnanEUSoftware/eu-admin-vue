import {
  postGetShowState
} from '@/api/public.js'
// cookie保存的天数
import config from '@/config'
import {
  forEach,
  hasOneOf,
  objEqual
} from '@/libs/tools'
import Main from '_cp/main'
const {
  title
} = config

export const getToken = () => {
  const token = window.sessionStorage.getItem('token')
  if (token !== 'false') return token
  else return false
}

export const getFromUrl = () => {
  const fromUrl = window.sessionStorage.getItem('fromUrl')
  if (fromUrl !== 'false') return fromUrl
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = {
    ...homeRoute,
    icon: homeRoute.meta.icon
  }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread
  }).map(item => {
    let meta = {
      ...item.meta
    }
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      meta.title = meta.title(route)
    }
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  // 过滤 hideInMenu
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{
    ...homeItem,
    to: homeRoute.path
  }, ...res]
}

export const getRouteTitleHandled = (route) => {
  let router = {
    ...route
  }
  let meta = {
    ...route.meta
  }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let {
    title
  } = item.meta
  if (!title) return
  title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  sessionStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = sessionStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const {
    name,
    path,
    meta
  } = newRoute
  let newList = [...list]

  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else {
    newList.push({
      name,
      path,
      meta
    })
  }
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}

/**
 *   根据分辨率 设置表格高度
 */

// export const tableHeight = (rows, listNum) => {
//   const winHeight = document.body.scrollHeight
//   let optionHeight = NaN
//   if (listNum < rows) {
//     rows = listNum
//   }
//   if (rows > 14 && winHeight < 1200) { // 2k分辨率以下
//     optionHeight = winHeight - 300
//     return optionHeight
//   } else if (rows > 10 && winHeight < 900) { // 正常分辨率以下
//     optionHeight = winHeight - 300
//     return optionHeight
//   } else if (rows > 25 && winHeight > 1400) { // 2k分辨率以上
//     optionHeight = winHeight - 300
//     return optionHeight
//   }
// }

export const tableHeight = () => {
  const winHeight = document.body.scrollHeight
  let optionHeight = NaN
  if (winHeight > 800) {
    optionHeight = winHeight - 700
  } else {
    optionHeight = winHeight - 450
  }

  return optionHeight
}

/**
 *   根据分辨率 设置表格按钮尺寸
 */
export const itemSize = () => {
  const winWidth = window.screen.width
  const winHeight = window.screen.height
  let size = 'default'
  if (winWidth <= 1920 && winHeight <= 1920) {
    size = 'small'
    return size
  } else {
    size = 'default'
    return size
  }
}

/**
 *   根据分辨率 设置组件尺寸
 */
export const itemVueSize = () => {
  const winWidth = window.screen.width
  const winHeight = window.screen.height
  let size = 'default'
  if (winWidth < 1920 && winHeight < 1920) {
    size = 'small'
    return size
  } else {
    size = 'default'
    return size
  }
}

// 生成路由
export const setRouterList = (arr) => {
  let newArr = []
  arr.forEach(router => {
    let {
      path,
      name,
      component,
      meta,
      children
    } = router
    if (children && children instanceof Array) {
      children = setRouterList(children)
    }

    let fmRouter = {
      path: path,
      component: () => import('@/view' + component),
      name: name,
      meta: meta,
      children: children
    }
    if (component === 'Main') {
      fmRouter.component = Main
    }
    newArr.push(fmRouter)
  })

  return newArr
}

/**
 *   将地址列表转为级联选择器需要的树形数组结构
 */
export const listConvertTree = (theLevelNum, list) => {
  const result = []
  // 遍历 tree
  list.forEach((item) => {
    // 解构赋值将数组对象的属性提出赋值给变量
    let {
      regionName: label,
      regionAid: value,
      children = [],
      loading = false
    } = item

    // 将变量组成对象放到 tree 数组中，如果为县级则不添加 children 数组
    // 地址级别 如果 theLevelNum 为 0 省级，为 1市级，为 2县/区级
    if (theLevelNum === 2) {
      result.push({
        label,
        value
      })
    } else {
      result.push({
        label,
        value,
        children,
        loading
      })
    }
  })

  return result
}

/**
 * 获取已分页数据，手动分页(需要手动分页)
 * @param {Array} needPageList 需要分页的数据
 * @param {Number} pageSize 每页数量
 * @param {Number} pageNum 页码
 */
export const getPaginatedData = (needPageList, pageSize, pageNum) => {
  let paginatedList = []
  if (needPageList instanceof Array && needPageList.length > 0) {
    for (let index in needPageList) {
      if (index >= (pageNum - 1) * pageSize && index < pageNum * pageSize) {
        paginatedList.push(needPageList[index])
      }
    }
    return paginatedList
  } else {
    return []
  }
}

export const getShowState = async (code) => {
  const { success, data } = await postGetShowState({ code })
  if (success) {
    return data.isShow
  } else {
    return false
  }
}
