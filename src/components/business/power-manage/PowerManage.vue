<template>
  <!-- 权限管理-权限管理 -->
  <div>
    <!-- 页头及导航 -->
    <a-page-header title="权限管理" />
    <!-- 数据筛选 -->
    <Card style="margin-bottom: 24px;">
      <div class="public-search" ref="search">
          <div>
            <div class="public-search-item">
              <span class="public-search-text">部门：</span>
              <div class="select-width">
                  <Select v-model="tableParams.departmentAid" filterable placeholder="请选择" @on-change="departmentChange" class="select-width">
                    <Option v-for="item in departmentList" :value="item.departmentAid" :key="item.departmentAid">{{item.departmentName}}</Option>
                  </Select>
              </div>
            </div>
            <div class="public-search-item">
              <span class="public-search-text">搜索：</span>
              <div class="public-input-search select-width">
                  <Input v-model.trim="tableParams.searchStaffName" search enter-button placeholder="请输入员工姓名搜索" clearable
                      @on-search="searchBtnClick" @on-change="searchChange" :maxlength="32" />
              </div>
            </div>
        </div>
      </div>
    </Card>
    <Card class="table-card" style="margin-bottom: 24px;">
      <div slot="title">
        <div class="title">
          权限列表
        </div>
      </div>
      <div class="table-statistical">
        <Icon type="ios-podium-outline" style="color: #5cadff; font-size: 24px;" />
        <div class="table-statistical-item">拥有权限员工数量：<b>{{ hasPowerStaffNum }}</b></div>
        <div class="table-statistical-item">未拥有权限员工数量：<b>{{ hasNotPowerStaffNum }}</b></div>
      </div>
      <div class="table">
        <!-- 数据表格 -->
        <Table :loading="isLoading" :columns="powerCol" :data="staffPowerRoleList">
          <!-- 权限页面 -->
          <template slot-scope="{ row }" slot="powerRoleList">
            <Tooltip placement="top" theme="light" transfer max-width="300">
              <div class="table-tooltip-text">
                <span v-for="(item,index) in row.powerRoleList" :key="index">
                  <Badge color="blue" :text="item.powerRoleName" style="margin-right:10px" />
                </span>
              </div>
              <div slot="content">
                <span v-for="(item,index) in row.powerRoleList" :key="index">
                  <Badge color="blue" :text="item.powerRoleName" style="margin-right:10px" />
                </span>
              </div>
            </Tooltip>
          </template>
          <!-- 操作 -->
          <template slot-scope="{ row }" slot="active">
            <div class="public-table-btn">
              <Button type="text" @click="insertOrUpdateClick(row.staffAid)">修改</Button>
            </div>
          </template>
        </Table>
        <Page v-if="totalNum > tableParams.num" :page-size-opts="[15, 25, 35, 50]" :transfer="true" show-elevator show-sizer
          :total="totalNum" :current="tableParams.pageNum" :page-size="tableParams.num"
          @on-change="changePageNum" @on-page-size-change="changePageSize"/>
      </div>
    </Card>
    <!-- 模态框 -->
    <a-modal v-model="modalInsertOrUpdate" :width="500"
        title="修改" cancelText="取消" okText="保存"
        @ok="sureInsertOrUpdate('insertOrUpdateForm')" @cancel="modalInsertOrUpdate = false">
      <Form ref="insertOrUpdateForm" :model="modalIUData" label-position="right" :label-width="120"
          style="width: 450px; margin: auto;">
        <FormItem label="部门名称：">
          {{ modalIUData.departmentName }}
        </FormItem>
        <FormItem label="员工：">
          {{ modalIUData.staffName }}【{{ modalIUData.phone }}】
        </FormItem>
        <FormItem label="拥有角色：" prop="powerRoleSelect"
                :rules="{required: true, message: '请选择员工拥有角色', trigger: 'change', type: 'array', min: 1}">
          <Select v-model="modalIUData.powerRoleSelect" multiple style="width: 300px;">
            <Option v-for="item in powerRoleList" :value="item.powerRoleAid" :key="item.powerRoleAid">{{ item.powerRoleName }}</Option>
          </Select>
        </FormItem>
      </Form>
    </a-modal>
  </div>
</template>

<script>
import {
  postGetDepartmentList,
  postGetStaffPowerRoleList,
  postGetStaffPowerRole,
  postGetPowerRoleList,
  postUpdateStaffPowerRole
} from '@/api/power-manage'
export default {
  name: 'RoleManage',
  data () {
    return {
      isLoading: false,
      totalNum: 0,
      hasPowerStaffNum: 0,
      hasNotPowerStaffNum: 0,
      // 部门列表
      departmentList: [],

      tableParams: {
        departmentAid: -1,
        searchStaffName: '', // 搜索员工名称
        pageNum: 1,
        num: 15
      },

      powerCol: [
        {
          title: '部门名称',
          key: 'departmentName',
          tooltip: true,
          minWidth: 180
        },
        {
          title: '姓名',
          key: 'staffName',
          tooltip: true,
          minWidth: 180
        },
        {
          title: '电话',
          key: 'phone',
          tooltip: true,
          minWidth: 180
        },
        {
          title: '拥有角色',
          slot: 'powerRoleList',
          tooltip: true,
          minWidth: 140
        },
        {
          title: '操作',
          slot: 'active',
          fixed: 'right',
          width: 120
        }
      ],
      staffPowerRoleList: [],

      // 模态框-新增修改
      modalInsertOrUpdate: false,
      modalIUData: {
        staffAid: -1,
        departmentName: '',
        staffName: '',
        phone: '',
        powerRoleSelect: []
      },
      powerRoleList: []
    }
  },
  created () {
    this.getDepartmentList()
    this.getPowerRoleList()
  },
  watch: {
    modalInsertOrUpdate (val) {
      if (val === false) {
        this.$refs['insertOrUpdateForm'].resetFields()
      }
    }
  },
  methods: {

    // 获取部门列表
    async getDepartmentList () {
      const { success, data } = await postGetDepartmentList()
      if (success) {
        this.departmentList = data || []
        if (data && data.length > 0) {
          this.$nextTick(() => {
            this.tableParams.departmentAid = data[0].departmentAid // 默认选中第一个
            this.getRoleList()
          })
        }
      }
    },

    // 获取角色列表
    async getRoleList () {
      this.isLoading = true
      const { success, data } = await postGetStaffPowerRoleList(this.tableParams)
      if (success) {
        this.totalNum = data.totalNum
        this.hasPowerStaffNum = data.hasPowerStaffNum
        this.hasNotPowerStaffNum = data.hasNotPowerStaffNum
        this.staffPowerRoleList = data.staffPowerRoleList || []
      }
      this.isLoading = false
    },

    departmentChange (value) {
      if (typeof value !== 'undefined') {
        this.getRoleList()
      }
    },

    // 点击查询
    searchBtnClick () {
      if (this.tableParams.searchStaffName !== '') {
        this.tableParams.pageNum = 1
        this.getRoleList()
      }
    },
    // 清空查询
    searchChange () {
      if (this.tableParams.searchStaffName === '') {
        this.tableParams.pageNum = 1
        this.getRoleList()
      }
    },
    /**
     * 改变每页显示数量
     * @param {number} pageSize 要改变数量的值
     */
    changePageSize (pageSize) {
      this.tableParams.pageNum = 1
      this.tableParams.num = pageSize
      this.getRoleList()
    },

    /**
     * 改变当前页码
     * @param {number} pageNum 要改变到的页码
     */
    changePageNum (pageNum) {
      this.tableParams.pageNum = pageNum
      this.getRoleList()
    },

    // 获取权限列表
    async getPowerRoleList () {
      const { success, data } = await postGetPowerRoleList()
      if (success) {
        this.powerRoleList = data || []
      }
    },

    // 新增修改模态框
    async insertOrUpdateClick (staffAid) {
      this.modalIUData.staffAid = staffAid
      const { success, data } = await postGetStaffPowerRole({ staffAid })
      if (success) {
        this.modalIUData.departmentName = data.departmentName
        this.modalIUData.staffName = data.staffName
        this.modalIUData.phone = data.phone
        this.modalIUData.powerRoleSelect = (data.staffPowerRoleList || []).map(item => item.powerRoleAid)
      }
      this.modalInsertOrUpdate = true
    },

    // 确定
    sureInsertOrUpdate (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let powerRoleList = JSON.stringify(this.modalIUData.powerRoleSelect.map(item => {
            return { powerRoleAid: item }
          }))
          let params = {
            staffAid: this.modalIUData.staffAid,
            powerRoleList
          }
          const { success } = await postUpdateStaffPowerRole(params)
          if (success) {
            this.modalInsertOrUpdate = false
            this.$Message.success('成功')
            this.getRoleList()
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
