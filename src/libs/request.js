
import axios from 'axios'
import qs from 'qs'
import {
  Message
} from 'view-design'

import {
  getToken
} from '@/libs/util'

// let token = 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VyS2V5Ijoie1wiY29tcGFueUNvZGVcIjpcIjlhM2M4MWZhNjJlNjBmNWMzNjk2MTY1YTRlNWU2YWM0XCIsXCJzdGFmZkNvZGVcIjpcIjlFNjgyNkJDNzlCMTQ3RDk4NkJDMkVGREQ1OTAyNUFCXCJ9IiwiaXNzIjoiZXVzb2Z0d2FyZSIsImF1ZCI6IjA5OGY2YmNkNDYyMWQzNzNjYWRlNGU4MzI2MjdiNGY2IiwiZXhwIjoxNTc4Mzg4NDAxLCJuYmYiOjE1Nzc5NTY0MDF9.DTY4UAG0eoO4YnkceSsiv3QHkanYEIUSC_Q9XOHMkVE'

// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const baseUrl = process.env.VUE_APP_BASE_URL
// const baseUrl = process.env.VUE_APP_BASE_URL || 'http://192.168.1.241:10510/hroStaffPcApi/'
// const baseUrl = process.env.VUE_APP_BASE_URL || 'http://192.168.1.191:10510/hroStaffPcApi/'
// const baseUrl = process.env.VUE_APP_BASE_URL || 'http://192.168.1.226/mock/471'
// const baseUrl = process.env.VUE_APP_BASE_URL || 'http://dev.chrsaas.eu/hreStaffPcApi/'
const portalUrl = process.env.VUE_APP_PORTAL_URL

/** **** 创建axios实例 ******/

const service = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 15000 // 请求超时时间
})
/** **** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use((config) => {
  config.method === 'post'
    ? config.data = qs.stringify({
      ...config.data
    })
    : config.params = {
      ...config.params
    }
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  config.headers['token'] = getToken()

  return config
})

service.interceptors.response.use(
  (response) => {
    if (response.data.code === 10000) {
      // 服务端定义的响应code码为0时请求成功
      // 使用Promise.resolve 正常响应
      response.data.success = true
      return Promise.resolve(response.data)
    } else if (response.data.code === 40001 || response.data.code === 40002) {
      // 若 token不存在，则跳转到上一个页面
      Message.error({
        content: response.data.message
      })
      sessionStorage.clear()
      window.location.replace(portalUrl + '/login')
    } else {
      if (response.data.code !== 70005) {
        Message.error({
          content: response.data.message
        })
      }
      // 暂存修改 返回错误值
      return Promise.resolve(response.data)
    }
  }, error => {
    let message = ''
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录'
          location.reload()
          break
        default:
          message = error.response.data.message
      }
      Message.error({
        content: message
      })
      // 请求错误处理
      return Promise.reject(error.response)
    } else {
      message = '连接服务器失败'
      Message.error({
        content: message
      })
      return Promise.reject(error)
    }
  }
)

export default service
