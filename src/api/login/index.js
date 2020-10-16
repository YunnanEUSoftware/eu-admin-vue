import request from '@/libs/request'

// 密码登录
export const postLogin = (params) => {
  let data = params
  return request({
    url: '/login/login',
    data,
    method: 'post'
  })
}

// 获取验证码
export const postGetImageCode = (params) => {
  let data = params
  return request({
    url: '/login/getImageCode',
    data,
    method: 'post'
  })
}

// 忘记密码 - 获取短信验证码
export const postGetMessageCode = (params) => {
  let data = params
  return request({
    url: '/login/getMessageCode',
    data,
    method: 'post'
  })
}

// 重置密码
export const postUpdateLoginKey = (params) => {
  let data = params
  return request({
    url: '/login/updateLoginKey',
    data,
    method: 'post'
  })
}
