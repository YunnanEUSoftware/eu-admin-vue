<template>
  <!-- 权限管理-角色管理 -->
  <div>
    <!-- 页头及导航 -->
    <a-page-header title="角色管理" />

    <!-- 数据筛选 -->
    <Card style="margin-bottom: 24px;">
      <div class="public-search" ref="search">
          <div>
            <div class="public-search-item">
              <span class="public-search-text">搜索：</span>
              <div class="public-input-search select-width">
                  <Input v-model.trim="tableParams.searchPowerRoleName" search enter-button placeholder="请输入角色名称搜索" clearable
                      @on-search="searchBtnClick" @on-change="searchChange" :maxlength="10" />
              </div>
            </div>
        </div>
      </div>
    </Card>
    <Card class="table-card" style="margin-bottom: 24px;">
      <div slot="title">
        <div class="title">
          角色列表
        </div>
        <div>
          <Button type="primary" @click="insertOrUpdateClick(-1)">新增</Button>
        </div>
      </div>
      <div class="table-statistical">
        <Icon type="ios-podium-outline" style="color: #5cadff; font-size: 24px;" />
        <div class="table-statistical-item">角色数量总计：<b>{{ powerRoleNum }}</b></div>
      </div>
      <div class="table">
        <!-- 数据表格 -->
        <Table :loading="isLoading" :columns="roleCol" :data="powerRoleList">
          <!-- 权限页面 -->
          <template slot-scope="{ row }" slot="powerRolePageList">
            <Tooltip placement="top" theme="light" transfer max-width="300">
              <div class="table-tooltip-text">
                <span v-for="(item,index) in row.powerRolePageList" :key="index">
                  <Badge color="blue" :text="item.powerPageName" style="margin-right:10px" />
                </span>
              </div>
              <div slot="content">
                <span v-for="(item,index) in row.powerRolePageList" :key="index">
                  <Badge color="blue" :text="item.powerPageName" style="margin-right:10px" />
                </span>
              </div>
            </Tooltip>
          </template>
          <!-- 操作 -->
          <template slot-scope="{ row }" slot="active">
            <div class="public-table-btn">
              <Button type="text" @click="insertOrUpdateClick(row.powerRoleAid)">修改</Button>
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
        :title="modalIUData.powerRoleAid === -1 ? '新增' : '修改'" cancelText="取消" okText="保存"
        @ok="sureInsertOrUpdate('insertOrUpdateForm')" @cancel="modalInsertOrUpdate = false">
      <Form ref="insertOrUpdateForm" :model="modalIUData" label-position="right" :label-width="120"
          style="width: 450px; margin: auto;">
        <FormItem label="名称：" prop="powerRoleName"
                :rules="[{trigger: 'blur', validator: nameCheckExists}]">
          <Input v-model.trim="modalIUData.powerRoleName" placeholder="请输入角色名称 " style="width: 300px;" :maxlength="10"></Input>
        </FormItem>
        <FormItem label="权限界面：" prop="powerPageSelect"
                :rules="{required: true, message: '请选择角色对应权限界面', trigger: 'change', type: 'array', min: 1}">
          <Select v-model="modalIUData.powerPageSelect" multiple style="width: 300px;">
            <Option v-for="item in powerPageList" :value="item.powerPageId" :key="item.powerPageId">{{ item.powerPageName }}</Option>
          </Select>
        </FormItem>
      </Form>
    </a-modal>
  </div>
</template>

<script>
import {
  postGetRoleList,
  postGetPowerPageList,
  postGetRoleListOfUpdate,
  postInsertPowerRolePage,
  postCheckPowerRoleNameExists
} from '@/api/role-manage'
export default {
  name: 'RoleManage',
  data () {
    return {
      isLoading: false,
      totalNum: 0,
      powerRoleNum: 0,
      tableParams: {
        searchPowerRoleName: '', // 搜索角色名称
        pageNum: 1,
        num: 15
      },

      roleCol: [
        {
          title: '角色',
          key: 'powerRoleName',
          tooltip: true,
          width: 180
        },
        {
          title: '权限页面',
          slot: 'powerRolePageList',
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
      powerRoleList: [],

      // 模态框-新增修改
      modalInsertOrUpdate: false,
      modalIUData: {
        powerRoleAid: -1,
        powerRoleName: '',
        powerPageSelect: []
      },
      powerPageList: [],

      nameCheckExists: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('角色名称不能为空！'))
        } else {
          this.checkPowerRoleNameExists(value).then(valid => {
            if (valid) {
              callback()
            } else {
              callback(new Error('角色名称已存在！'))
            }
          })
        }
      }
    }
  },
  created () {
    this.getRoleList()
    this.getPowerPageList()
  },
  watch: {
    modalInsertOrUpdate (val) {
      if (val === false) {
        this.$refs['insertOrUpdateForm'].resetFields()
      }
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      this.isLoading = true
      const { success, data } = await postGetRoleList(this.tableParams)
      if (success) {
        this.totalNum = data.totalNum
        this.powerRoleNum = data.powerRoleNum
        this.powerRoleList = data.powerRoleList || []
      }
      this.isLoading = false
    },

    // 点击查询
    searchBtnClick () {
      if (this.tableParams.searchPowerRoleName !== '') {
        this.tableParams.pageNum = 1
        this.getRoleList()
      }
    },
    // 清空查询
    searchChange () {
      if (this.tableParams.searchPowerRoleName === '') {
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

    // 获取权限界面列表
    async getPowerPageList () {
      const { success, data } = await postGetPowerPageList()
      if (success) {
        this.powerPageList = data || []
      }
    },

    // 检查名称是否重复
    async checkPowerRoleNameExists (value) {
      const { success, data } = await postCheckPowerRoleNameExists({ powerRoleAid: this.modalIUData.powerRoleAid, powerRoleName: value })
      return success && data.hasExists === 0
    },

    // 新增修改模态框
    async insertOrUpdateClick (powerRoleAid) {
      this.modalIUData.powerRoleAid = powerRoleAid
      if (powerRoleAid !== -1) {
        const { success, data } = await postGetRoleListOfUpdate({ powerRoleAid })
        if (success) {
          this.modalIUData.powerRoleName = data.powerRoleName
          this.modalIUData.powerPageSelect = (data.powerPageList || []).map(item => item.powerPageId)
        }
      } else {
        this.modalIUData.powerRoleName = ''
        this.modalIUData.powerPageSelect = []
      }
      this.modalInsertOrUpdate = true
    },

    // 确定
    sureInsertOrUpdate (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let powerPageList = JSON.stringify(this.modalIUData.powerPageSelect.map(item => {
            return { powerPageId: item }
          }))
          let params = {
            powerRoleAid: this.modalIUData.powerRoleAid,
            powerRoleName: this.modalIUData.powerRoleName,
            powerPageList
          }
          const { success } = await postInsertPowerRolePage(params)
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
