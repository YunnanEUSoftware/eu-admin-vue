import request from '@/libs/request'

/**
 * 权限管理-权限管理
 */

// 1、获取部门列表
export const postGetDepartmentList = (params = {}) => {
  let data = { ...params }
  return request({
    url: '/index/powerManage/getDepartmentList',
    data,
    method: 'post'
  })
}

// 2、获取员工权限列表
export const postGetStaffPowerRoleList = (params = {}) => {
  let data = { ...params }
  return request({
    url: '/index/powerManage/getStaffPowerRoleList',
    data,
    method: 'post'
  })
}

// 3、修改-获取指定员工拥有角色列表
export const postGetStaffPowerRole = (params = {}) => {
  let data = { ...params }
  return request({
    url: '/index/powerManage/getStaffPowerRole',
    data,
    method: 'post'
  })
}

// 4、修改-获取角色列表
export const postGetPowerRoleList = (params = {}) => {
  let data = { ...params }
  return request({
    url: '/index/powerManage/getPowerRoleList',
    data,
    method: 'post'
  })
}

// 5、修改指定员工拥有角色
export const postUpdateStaffPowerRole = (params = {}) => {
  let data = { ...params }
  return request({
    url: '/index/powerManage/updateStaffPowerRole',
    data,
    method: 'post'
  })
}
