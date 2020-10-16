<template>
  <!-- 员工管理 -->
  <div>
    <!-- 页头及导航 -->
    <a-page-header title="员工管理" />

    <Row :gutter="16">
      <Col class="left" span="5">
        <Card>
          <ElTreeStaff
            ref="eltree"
            :treeData="departmentList"
            :openKeyS="openKey"
            :key="openKey"
            @getSelectData="getChooseTree"
          />
        </Card>
      </Col>

      <!-- 部门/分公司无员工展示 -->
      <Col class="right" span="19">
        <Card class="menu-content card-overflow" v-if="pageFlag === 1">
          <div class="kong-cont">
            <g-icon class="icon-large" name="kongzhuangtai"></g-icon>
            <p class="kong-cont-title">当前没有下级部门</p>
            <p class="kong-cont-text">请先新增部门，然后新增员工</p>
        </div>
        </Card>
        <!-- 表格展示 -->
        <template v-if="pageFlag === 2">
          <Card key="0" class="menu-content card-overflow">
            <div class="public-search" ref="search">
              <div>
                <div class="public-search-item">
                  <span class="public-search-text">状态：</span>
                  <div class="public-input-search select-width">
                  <Select
                    v-model="tableParams.stateId"
                    @on-change="stateChange"
                    placeholder="请选择员工状态"
                    class="darg-input"
                    transfer
                  >
                    <Option
                      v-for="item in stateList"
                      :value="item.stateId"
                      :key="item.stateId"
                      :label="item.stateName"
                    ></Option>
                  </Select>
                  </div>
                </div>
                <div class="public-search-item">
                  <span class="public-search-text">搜索：</span>
                  <div class="public-input-search select-width">
                      <Input v-model.trim="tableParams.searchStaffNameOrPhone" search enter-button placeholder="请输入姓名/电话搜索" clearable
                          @on-search="searchVal" @on-change="autoSearch" :maxlength="32" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card key="1" class="table-card" style="margin-bottom: 24px;">
            <div slot="title">
              <div class="title">
                员工列表
              </div>
              <div>
                <template v-if="btnShow">
                  <Button type="primary" @click="openAppened(-1)">新增</Button>
                </template>
                <template v-else>
                  <Poptip trigger="hover" title="此部门不可新增" content="新增员工 请选中下级部门" transfer>
                    <Button type="primary" disabled>新增</Button>
                  </Poptip>
                </template>
              </div>
            </div>
            <div class="table-statistical">
              <Icon type="ios-podium-outline" style="color: #5cadff; font-size: 24px;" />
              <div class="table-statistical-item">在职合计：<b>{{ onStaffNum }}</b></div>
              <div class="table-statistical-item">离职合计：<b>{{ resignNum }}</b></div>
            </div>
            <Table :loading="staffLoading" :columns="staffColumn" :data="staffData" :max-height="styleObject.maxHeight">
              <template slot-scope="{ row, index }" slot="stateName">
                <div v-if="row.stateId === 10"><Badge color="blue" :text="row.stateName" /></div>
                <div v-if="row.stateId === 20"><Badge color="grey" :text="row.stateName" /></div>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <div class="public-table-btn">
                  <Button type="text" ghost @click="openAppened(row)">修改</Button>
                  <Dropdown transfer @on-click="dropDownClick($event,row)">
                    <Button type="text" ghost>
                      更多
                      <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                      <DropdownItem name="unfire" v-if="row.stateId === 10">离职</DropdownItem>
                      <DropdownItem name="refire" v-if="row.stateId === 20">重新入职</DropdownItem>
                      <DropdownItem name="adjustDep">调整部门</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </template>
            </Table>
            <Page v-if="totalNum > tableParams.num"
              transfer
              :total="totalNum"
              show-total
              show-elevator
              show-sizer
              :page-size="tableParams.num"
              :current="tableParams.pageNum"
              :page-size-opts="[5,10,15,30]"
              @on-change="setPage"
              @on-page-size-change="setPageSize"
            />
          </Card>
        </template>
      </Col>
    </Row>

    <!-- 修改 -->
    <modify-operator ref="modify" @getStaffInfoList="getStaffInfoList"></modify-operator>
  </div>
</template>

<script>
import Icons from '_cp/icons'
import ElTreeStaff from '_cp/el-tree-staff'
import SearchInput from '_cp/search-input'
import {
  getDepartmentList,
  onOrResignStaff,
  getStaffList,
  getStaffStateList
} from '@/api/staff-manage'
import ModifyOperator from './ModifyOperator'
export default {
  name: 'StaffManage',
  components: {
    'g-icon': Icons,
    ElTreeStaff,
    SearchInput,
    'modify-operator': ModifyOperator
  },
  data () {
    return {
      // 部门列表
      departmentList: [],
      // tree 相关
      openKey: -1, // 选中的项
      openMidkey: null, // 中间变量 记录修改过的值

      pageFlag: 1,
      tableParams: {
        searchStaffNameOrPhone: '', // 搜索用
        stateId: '',
        departmentAid: '',
        pageNum: 1,
        num: 10
      },
      stateList: [],
      totalNum: 0,
      onStaffNum: 0,
      resignNum: 0,
      staffLoading: false,
      staffColumn: [
        {
          title: '姓名',
          key: 'staffName',
          fixed: 'left',
          tooltip: true,
          minWidth: 120
        },
        {
          title: '状态',
          slot: 'stateName',
          minWidth: 120
        },
        {
          title: '性别',
          key: 'staffSex',
          minWidth: 65
        },
        {
          title: '电话',
          key: 'phone',
          tooltip: true,
          minWidth: 140
        },
        {
          title: '部门编号',
          key: 'departmentCode',
          tooltip: true,
          minWidth: 180
        },
        {
          title: '工号',
          key: 'staffCode',
          tooltip: true,
          minWidth: 130
        },
        {
          title: '身份证号',
          key: 'idCode',
          tooltip: true,
          minWidth: 190
        },
        {
          title: '邮箱',
          key: 'email',
          tooltip: true,
          minWidth: 200
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 170
        }
      ],
      staffData: [],

      btnShow: false,

      // 表格高度
      styleObject: {
        maxHeight: ''
      }
    }
  },
  created () {
  },
  mounted () {
    this.getDepartmentList()
    this.tableHeight()
  },
  methods: {
    tableHeight () {
      const winHeight = document.body.scrollHeight
      let optionHeight = NaN
      optionHeight = winHeight - 450
      this.styleObject.maxHeight = optionHeight
    },
    // 根据公司编码获取部门列表
    async getDepartmentList () {
      const { success, message, data } = await getDepartmentList()
      if (success) {
        this.departmentList = JSON.parse(JSON.stringify(data))

        if (!this.departmentList[0].children) {
          this.pageFlag = 1
        } else {
          this.tableParams.departmentAid = data[0].departmentAid
          this.openKey = this.tableParams.departmentAid
          this.getStateList()
        }
      } else {
        this.$Message.error(message)
      }
    },
    // 点击树 请求信息视图
    getChooseTree (val) {
      if (val.fatherAid === -1) {
        this.btnShow = false
      } else {
        this.btnShow = true
      }
      this.tableParams.departmentAid = val.departmentAid
      this.getStateList()
    },
    // 获取状态类型
    async getStateList () {
      const { success, message, data } = await getStaffStateList()
      if (success) {
        this.stateList = data
        this.tableParams.stateId = this.stateList[0].stateId
        this.$nextTick(() => {
          this.getStaffInfoList()
        })
      } else {
        this.$Message.error(message)
      }
    },
    // 获取员工信息表格
    async getStaffInfoList () {
      this.staffLoading = true
      const { success, message, data } = await getStaffList(this.tableParams)
      if (success) {
        this.pageFlag = 2
        this.staffLoading = false
        this.totalNum = data.totalNum
        this.onStaffNum = data.onStaffNum
        this.resignNum = data.resignNum
        this.staffData = data.staffList
      } else {
        this.$Message.error(message)
      }
    },

    // dropdown点击事件
    dropDownClick (name, row) {
      switch (name) {
        case 'unfire':
          this.getModifyInfo(1, row)
          break
        case 'refire':
          this.getModifyInfo(0, row)
          break
        case 'adjustDep':
          this.openAdjustDep(row)
          break
      }
    },
    // 离职入职
    getModifyInfo (item, val) {
      let modleInfo = {
        title: '',
        cont: ''
      }
      if (item) {
        modleInfo.title = '离职确认'
        modleInfo.cont = '确认让这个员工离职吗？'
        let params = {
          staffAid: val.staffAid,
          operateFlag: 1
        }
        this.$Modal.confirm({
          title: modleInfo.title,
          content: modleInfo.cont,
          onOk: () => {
            this.sureUorRStaff(params)
          }
        })
      } else {
        modleInfo.title = '入职确认'
        modleInfo.cont = '确认让这个员工重新入职吗？'
        let params = {
          staffAid: val.staffAid,
          operateFlag: 0
        }
        this.$Modal.confirm({
          title: modleInfo.title,
          content: modleInfo.cont,
          onOk: () => {
            this.sureUorRStaff(params)
          }
        })
      }
    },
    // 离职/重新入职
    async sureUorRStaff (params) {
      const { success, message } = await onOrResignStaff(params)
      if (success) {
        this.getStaffInfoList()
        this.$Message.success('操作成功')
      } else {
        this.$Message.error(message)
      }
    },
    // 打开模态框
    openAppened (val) {
      this.$refs.modify.openAppened(val)
    },
    // 打开调整部门
    openAdjustDep (row) {
      this.$refs.modify.openAdjustDep(row)
    },

    selectSalary (name) {
      // 切换视图 请求参数置空
      if (this.pageFlag !== 1) this.getStateList()
      this.tableParams.departmentAid = -1
      this.tableParams.searchStaffNameOrPhone = ''
    },

    stateChange (val) {
      if (val || val === 0) {
        this.tableParams.pageNum = 1
        this.tableParams.stateId = val
        this.getStaffInfoList()
      }
    },
    // 清空查询
    autoSearch () {
      if (this.tableParams.searchStaffNameOrPhone === '') {
        this.searchVal()
      }
    },
    searchVal (val) {
      this.tableParams.pageNum = 1
      this.tableParams.searchStaffNameOrPhone = val
      this.getStaffInfoList()
    },
    setPage (event) {
      this.tableParams.pageNum = event
      this.getStaffInfoList()
    },
    setPageSize (event) {
      this.tableParams.pageNum = 1
      this.tableParams.num = event
      this.getStaffInfoList()
    }
  }
}
</script>

<style lang="less" scoped>

.card-overflow {
  overflow: auto;
  margin-bottom: 24px;
}

.menu-content{
  /deep/.ivu-menu-vertical .ivu-menu-submenu-title-icon{
    position: absolute;
    .ivu-menu-submenu-title{
      #text::after{
        content: '';
        border-bottom: 70px solid red;
      }
    }
  }
}

.left {
  width: 35% !important;
  max-width: 320px !important;
  margin-right: 16px !important;
}
.right {
  width: calc(~"100% - 336px") !important;
}

.kong-cont {
  width: 100%;
}

.kong-cont {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  .icon-large {
    width: 200px;
    height: 200px;
    margin-right: -24px;
  }
  .kong-cont-title {
    font-size: 16px;
    font-weight: 600;
    color: #666666;
    margin: 24px 0 0  0
  }
  .kong-cont-text {
    font-size: 14px;
    margin: 16px 0 ;
    color: #b2b2b2;
  }
}

// 搜索框 图标
 .ivu-input-icon-clear {
  right: 38px !important
}
 .ivu-input-search{
  padding: 0 10px !important
}

</style>
