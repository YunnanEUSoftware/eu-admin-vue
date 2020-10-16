import request from '@/libs/request'

// 1、获取部门列表树结构
export const getDepartmentList = () => {
  return request({
    url: '/index/departmentManage/getDepartmentList',
    method: 'post'
  })
}

// 2、获取指定部门基本信息
export const getDepartmentInfo = (params) => {
  let data = { ...params }
  return request({
    url: '/index/departmentManage/getDepartmentInfo',
    data,
    method: 'post'
  })
}

// 3、新增/修改-获取地域列表
export const getRegionList = (params) => {
  let data = { ...params }
  return request({
    url: '/index/departmentManage/getRegionList',
    data,
    method: 'post'
  })
}

// 4、新增/修改部门基本信息
export const insertOrUpdateDepartmentInfo = (params) => {
  let data = { ...params }
  return request({
    url: '/index/departmentManage/insertOrUpdateDepartmentInfo',
    data,
    method: 'post'
  })
}

// 5、新增/修改-获取是否存在同级部门名称
export const existDepartmentInfo = (params) => {
  let data = { ...params }
  return request({
    url: '/index/departmentManage/existDepartmentInfo',
    data,
    method: 'post'
  })
}

// 6、启用/停用部门
export const hasEnableDepartment = (params) => {
  let data = { ...params }
  return request({
    url: '/index/departmentManage/hasEnableDepartment',
    data,
    method: 'post'
  })
}
