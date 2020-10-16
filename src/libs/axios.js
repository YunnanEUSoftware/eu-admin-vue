import axios from 'axios'
import qs from 'qs'
import { Message } from 'iview'

import { getToken } from '@/libs/util'
// 登录路径
const loginUrl = process.env.VUE_APP_PORTAL_URL || 'http://192.168.1.43:8080'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    // 队列空对象,用于存放所有未请求的 url，当队列为空时，表示所有 url 请求完，这样可以只需要一次添加 loading 加载效果，不需要重复添加 loading 效果
    this.queue = {}
  }
  // 处理队列
  destroy (url) {
    delete this.queue[url]
  }
  // 拦截器
  interceptors (instance, url) {
    // axios 请求拦截器, config 是请求成功时的处理函数，error 是请求出现错误时的处理函数
    instance.interceptors.request.use(config => {
      // 将请求的 url 放入队列中
      this.queue[url] = true
      // 配置参数
      config.method === 'post'
        ? config.data = qs.stringify({
          ...config.paramsData
        })
        : config.params = {
          ...config.params
        }
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.headers['token'] = getToken()
      return config
    }, error => {
      // 请求失败时，直接抛出这个错误
      return Promise.reject(error)
    })

    // axios 响应拦截器，对返回的结果的处理筛选
    instance.interceptors.response.use(response => {
      // 响应成功后就删除该队列对应的 url
      this.destroy(url)

      // 返回数据
      if (response.data.code === 10000) {
        // 服务端定义的响应 code 码为 0 时请求成功
        // 使用 Promise.resolve 正常响应

        return Promise.resolve(response.data)
      } else if (response.data.code === 40001 || response.data.code === 40002) {
        // 若 token不存在，则跳转到上一个页面

        Message.warning({
          content: '登录过期，请重新登录',
          duration: 3.5,
          onClose: () => {
            window.sessionStorage.removeItem('token')
            window.location.replace(loginUrl)
          }
        })
      } else {
        Message.error({
          content: response.data.message
        })
        // 暂存修改 返回错误值
        return Promise.resolve(response.data)
      }
    }, error => {
      // 响应失败后就删除该队列对应的 url
      this.destroy(url)

      // 响应失败时
      let message = ''
      if (error && error.response) {
        switch (error.response.status) {
          case 401:
            message = '未授权，请重新登录'
            // 刷新
            location.reload()
            break
          default:
            message = error.response.data.message
        }
        Message.error({
          content: message
        })
        // 响应失败时，直接抛出这个错误
        return Promise.reject(error.response)
      } else {
        message = '连接服务器失败'
        Message.error({
          content: message
        })
        return Promise.reject(error)
      }
    })
  }

  // 创建一个请求 request 方法, options 是单独传入请求的配置 如参数
  request (options) {
    // 创建一个 axios 实例
    const instance = axios.create({
      baseURL: this.baseUrl, // api的 base_url
      timeout: 15000 // 请求超时时间
    })
    // axios 实例为参数的拦截器
    this.interceptors(instance, options.url)
    // 返回 axios 的实例，配置参数是合并后的参数
    return instance(options)
  }
}
export default HttpRequest
