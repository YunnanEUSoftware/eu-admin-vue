import { getToken } from '@/libs/util'

// 引入网络请求工具 axios
let axios = require('axios')

// 全局地址（部分地方需要单独使用根地址）
const BASEURL = process.env.VUE_APP_BASE_URL
// 网络请求的 base 地址
axios.defaults.baseURL = BASEURL

// 下载文件请求 fileType文件类型，默认xlsx, 0为xlsx, 1为xls
const getFile = (url, params, success, failure, fileType = 0) => {
  let fileTypeStr = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  if (fileType === 1) {
    fileTypeStr = 'application/vnd.ms-excel;'
  }

  // 将参数处理为 FormData
  let formData = new FormData()
  if (params) {
    for (let key in params) {
      formData.append(key, params[key])
    }
    // 重新给params赋值
    params = formData
  }
  axios({
    method: 'POST',
    url: url,
    data: params || null,
    withCredentials: false,
    responseType: 'blob',
    headers: {
      'token': getToken()
    },
    timeout: 30000
  }).then((res) => {
    // 获取相应头
    let headers = res.headers
    // 生成blob
    let blob = new Blob([res.data], { type: fileTypeStr })
    // 生成超链接元素
    let link = document.createElement('a')
    // 生成包含blob对象的链接
    link.href = window.URL.createObjectURL(blob)
    // 获取包含文件名的响应头
    const fileParam = headers['content-disposition']
    // 截取文件名
    let fileName = (fileParam || '').includes('filename=') ? (fileParam || '').split('=')[1] : '下载的表单文件'
    // 解码文件名【此处解码的为后端的UTF-8编码】
    fileName = decodeURIComponent(fileName)
    // 设置下载的文件名
    link.download = fileName
    // html添加link节点【此步骤为了兼容FireFox浏览器】
    document.body.appendChild(link)
    // 模拟点击下载
    link.click()
    // 移除link节点
    document.body.removeChild(link)
    // 执行成功回调
    if (success) {
      success()
    }
  }).catch((err) => {
    // 如果有失败参数调用失败参数
    console.log(err)
    // 执行失败回调
    if (failure) {
      failure()
    }
  })
}

/**
 * 返回在vue模版中调用
 */
export default {

  getFile,

  // 抛出地址（上传文件等地方需要使用）
  BASEURL: BASEURL

}
