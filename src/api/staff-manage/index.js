import request from '@/libs/request'

// 1、获取部门列表树结构
export const getDepartmentList = () => {
  return request({
    url: '/index/staffManage/getDepartmentList',
    method: 'post'
  })
}

// 2、获取员工状态列表
export const getStaffStateList = () => {
  return request({
    url: '/index/staffManage/getStaffStateList',
    method: 'post'
  })
}

// 3、获取员工列表
export const getStaffList = (params) => {
  let data = { ...params }
  return request({
    url: '/index/staffManage/getStaffList',
    data,
    method: 'post'
  })
}

// 4、入职/离职操作
export const onOrResignStaff = (params) => {
  let data = { ...params }
  return request({
    url: '/index/staffManage/onOrResignStaff',
    data,
    method: 'post'
  })
}

// 5、新增/修改 - 获取银行列表
export const getBankList = () => {
  return request({
    url: '/index/staffManage/getBankList',
    method: 'post'
  })
}

// 6、新增/修改 - 获取要修改员工信息
export const getStaffInfo = (params) => {
  let data = { ...params }
  return request({
    url: '/index/staffManage/getStaffInfo',
    data,
    method: 'post'
  })
}

// 7、新增/修改员工信息
export const insertOrUpdateStaffInfo = (params) => {
  let data = { ...params }
  return request({
    url: '/index/staffManage/insertOrUpdateStaffInfo',
    data,
    method: 'post'
  })
}

// 8、调整部门-获取员工可调整部门列表
export const getCanAdjustDepartmentList = (params) => {
  let data = { ...params }
  return request({
    url: '/index/staffManage/getCanAdjustDepartmentList',
    data,
    method: 'post'
  })
}

// 9、调整部门-调整员工所属部门
export const adjustStaffDepartment = (params) => {
  let data = { ...params }
  return request({
    url: '/index/staffManage/adjustStaffDepartment',
    data,
    method: 'post'
  })
}
