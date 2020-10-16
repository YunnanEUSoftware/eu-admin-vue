import Main from '_cp/main'

export default [
  {
    path: '/organization',
    name: '组织架构',
    meta: {
      icon: 'md-recording',
      title: '组织架构'
    },
    component: Main,
    children: [
      {
        path: 'departmentManage',
        name: 'departmentManage',
        meta: {
          title: '部门管理'
        },
        component: () => import('@/view/department-manage/DepartmentManage')
      },
      {
        path: 'staffManage',
        name: 'staffManage',
        meta: {
          title: '员工管理'
        },
        component: () => import('@/view/staff-manage/StaffManage')
      }
    ]
  },
  {
    path: '/authority',
    name: '权限管理',
    meta: {
      icon: 'md-recording',
      title: '权限管理'
    },
    component: Main,
    children: [
      {
        path: 'roleManage',
        name: 'roleManage',
        meta: {
          title: '角色管理'
        },
        component: () => import('@/view/role-manage/RoleManage')
      },
      {
        path: 'powerManage',
        name: 'powerManage',
        meta: {
          title: '权限管理'
        },
        component: () => import('@/view/power-manage/PowerManage')
      }
    ]
  },
  {
    path: '/systemConfig',
    name: '系统配置',
    meta: {
      icon: 'md-recording',
      title: '系统配置'
    },
    component: Main,
    children: [
      {
        path: 'powerPageConfig',
        name: 'powerPageConfig',
        meta: {
          title: '界面配置'
        },
        component: () => import('@/view/power-page-config/PowerPageConfig')
      }
    ]
  }
]
