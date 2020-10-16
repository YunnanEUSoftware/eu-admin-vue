import request from '@/libs/request'

/**
 * 权限管理-角色管理
 */

// 1、获取角色列表
export const postGetRoleList = (params = {}) => {
  let data = { ...params }
  return request({
    url: '/index/roleManage/getRoleList',
    data,
    method: 'post'
  })
}

// 2、新增/修改 - 获取权限界面列表
export const postGetPowerPageList = (params = {}) => {
  let data = { ...params }
  return request({
    url: '/index/roleManage/getPowerPageList',
    data,
    method: 'post'
  })
}

// 3、修改-获取指定角色信息及拥有权限页面列表
export const postGetRoleListOfUpdate = (params = {}) => {
  let data = { ...params }
  return request({
    url: '/index/roleManage/getRoleListOfUpdate',
    data,
    method: 'post'
  })
}

// 4、新增/修改角色及对应权限界面
export const postInsertPowerRolePage = (params = {}) => {
  let data = { ...params }
  return request({
    url: '/index/roleManage/insertPowerRolePage',
    data,
    method: 'post'
  })
}

// 5、校验新增/修改的角色名称是否已存在
export const postCheckPowerRoleNameExists = (params = {}) => {
  let data = { ...params }
  return request({
    url: '/index/roleManage/checkPowerRoleNameExists',
    data,
    method: 'post'
  })
}
