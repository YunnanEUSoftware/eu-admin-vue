
export default {
  state: {
    // token,不缓存token时刷新后token消失
    token: window.sessionStorage.getItem('token') == null ? '-1'
      : window.sessionStorage.getItem('token'),
    // 公司Code
    companyCode: window.sessionStorage.getItem('companyCode') ? 'code'
      : window.sessionStorage.getItem('companyCode'),
    // 登录名
    loginName: window.sessionStorage.getItem('loginName') == null ? ''
      : JSON.parse(window.sessionStorage.getItem('loginName')),
    // 公司信息
    companyInfo: window.sessionStorage.getItem('companyInfo') == null ? ''
      : JSON.parse(window.sessionStorage.getItem('companyInfo'))
  },
  mutations: {
    // 更新token
    updateToken (state, token) {
      state.token = token
      window.sessionStorage.setItem('token', token)
    },
    updateLoginName (state, loginName) {
      state.loginName = loginName
      window.sessionStorage.setItem('loginName', JSON.stringify(loginName))
    },

    updateCompanyCode (state, companyCode) {
      state.companyCode = companyCode
      window.sessionStorage.setItem('companyCode', companyCode)
    },
    // 存入公司各种信息
    upCompanyInfo (state, companyInfo) {
      state.companyInfo = companyInfo
      window.sessionStorage.setItem('companyInfo', JSON.stringify(companyInfo))
    }
  },
  actions: {

  }
}
