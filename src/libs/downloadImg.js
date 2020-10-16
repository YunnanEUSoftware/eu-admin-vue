// 浏览器类型判断
const browserType = () => {
  let userAgent = navigator.userAgent
  let isOpera = userAgent.indexOf('OPR') > -1
  let isChrome = userAgent.indexOf('Chrome') > -1
  // 判断是否Opera浏览器
  if (isChrome && (userAgent.indexOf('OPR') > -1)) {
    return 'Opera'
  }

  // qq/uc/搜狗/360 浏览器都可以使用chrome的下载方式，但是chrome转为blob地址下载会有一定的请求延时，当文件很大时交互不好
  // 判断是否QQ浏览器
  if (isChrome && (userAgent.indexOf('QQBrowser') > -1)) {
    return 'QQ'
  }
  // 判断是否UC浏览器
  if (isChrome && (userAgent.indexOf('UBrowser') > -1)) {
    return 'UC'
  }
  // 判断是否搜狗浏览器
  if (isChrome && (userAgent.indexOf('MetaSr') > -1 || userAgent.indexOf('SE') > -1)) {
    return '搜狗'
  }
  // 判断是否360浏览器
  if (isChrome && is360()) {
    return '360'
  }
  // 判断是否Firefox浏览器
  if (userAgent.indexOf('Firefox') > -1) {
    return 'Firefox'
  }
  // 判断是否Chrome浏览器
  if (isChrome) {
    return 'Chrome'
  }
  // 判断是否Safari浏览器
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari'
  }
  // 判断是否IE浏览器
  if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
    return 'IE'
  }
  // 判断是否Edge浏览器
  if (userAgent.indexOf('Trident') > -1) {
    return 'Edge'
  }
}

// 判断是否为360
const is360 = () => {
  let mimeTypes = navigator.mimeTypes
  for (let mt in mimeTypes) {
    if (mimeTypes[mt]['type'] === 'application/vnd.chromium.remoting-viewer') {
      return true
    }
  }
  return false
}

/**
 * 创建使用img下载
 * @param imgSrc 图片地址
 */
const createIframe = (imgSrc, imgName) => {
  let canvas = document.createElement('canvas')
  let img = document.createElement('img')
  img.crossOrigin = 'Anonymous'

  // 截取图片地址上的图片后缀
  let urlList = imgSrc.split('/')
  let strList = urlList[urlList.length - 1].split('.')
  let imgTypeList = ['png', 'jpg', 'jpeg']
  let suffix = imgTypeList.indexOf(strList[strList.length - 1]) > -1 ? strList[strList.length - 1] : 'png'

  // 图片加载完成下载
  img.onload = function (e) {
    canvas.width = img.width
    canvas.height = img.height
    let context = canvas.getContext('2d')
    context.drawImage(img, 0, 0, img.width, img.height)

    let name = (imgName || 'download') + '.' + suffix
    // 下载
    window.navigator.msSaveBlob(canvas.msToBlob(), name)
  }
  img.src = imgSrc
}

/**
 * 将图片转为blob后使用a标签下载
 * 需要将图片请求禁止缓存，否则会因为缓存后报跨域错误
 * @param url 图片url
 */
const imgToBlob = (url, name) => {
  fetch(url, {
    headers: {
      'Cache-control': 'no-cache',
      'Expires': 0
    }
  })
    .then((res) => {
      return res.blob()
    })
    .then((blob) => { // 将链接地址字符内容转变成blob地址
      let blobUrl = URL.createObjectURL(blob)
      creatALink(blobUrl, name)
    })
}

/**
 * 创建 a 标签下载图片
 * @param url 图片地址
 * @param name 图片名称
 */
const creatALink = (url, name) => {
  // 创建隐藏的可下载链接
  let eleLink = document.createElement('a')
  eleLink.download = name || 'download'
  eleLink.style.display = 'none'

  eleLink.href = url
  // 模拟点击下载
  document.body.appendChild(eleLink)
  eleLink.click()

  // 下载完成移除
  document.body.removeChild(eleLink)
}

/**
 * 获取url里带的文件后缀名
 * @param {String} url 地址
 */
const getSuffixFromUrl = (url = '') => {
  let strList = url.match(/^.+\/(\w+\.\w+)/i)
  let fileName = ''
  if (strList && strList.length > 1) {
    fileName = strList[1]
    let index = fileName.lastIndexOf('.')
    let suffix = fileName.substr(index + 1)
    return '.' + suffix
  } else {
    return ''
  }
}

/**
 * 点击下载
 * @param url 图片地址
 * @param name 图片名称
 */
const downloadClick = (url, name) => {
  let suffix = getSuffixFromUrl(url)
  let nameAndSuffix = name + suffix
  if (browserType() === 'IE' || browserType() === 'Edge') {
    createIframe(url, nameAndSuffix)
  } else if (browserType() === 'Chrome' || browserType() === 'Firefox' || browserType() === 'Opera') {
    imgToBlob(url, nameAndSuffix)
  } else {
    creatALink(url, nameAndSuffix)
  }
}

export default {
  downloadClick
}
