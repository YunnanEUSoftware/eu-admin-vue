// import config from '@/config'
// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const baseUrl = process.env.VUE_APP_BASE_URL || 'http://192.168.1.43:8080'
export default baseUrl
