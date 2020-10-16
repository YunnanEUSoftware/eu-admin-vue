import request from '@/libs/request'

// 获取展示状态
export const postGetShowState = (data) => {
  return request({
    url: '/public/getShowState',
    data,
    method: 'post'
  })
}

/**
 * 下面的文档里没有↓↓↓↓
 */
// 获取银行列表
export const postBankList = () => {
  return request({
    url: '/common/selectBank',
    method: 'post'
  })
}

// 获取民族列表
export const postEthnicityList = () => {
  return request({
    url: '/common/ethnicityList',
    method: 'post'
  })
}

// 获取地区列表
export const postRegionList = (paramsData) => {
  let data = {
    regionAid: paramsData.regionAid
  }
  return request({
    url: '/common/getRegionList',
    data,
    method: 'post'
  })
}
