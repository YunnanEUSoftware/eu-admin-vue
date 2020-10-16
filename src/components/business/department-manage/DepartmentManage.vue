<template>
  <div >
    <!-- 页头及导航 -->
    <a-page-header title="部门管理" />

    <Card class="card-overflow">
      <div class="left-right-cont">
        <div class="left">
          <elTree
            ref="eltree"
            :treeData="departmentList"
            :openKeyS="openKey"
            @getSelectData="getChooseTree"
            @getAddData="getAddTree"
          />
        </div>
        <!-- 总公司无下级部门 -->
        <template v-if="pageFlag === 0 ">
          <div class="kong-cont">
            <g-icon class="icon-large" name="kongzhuangtai"></g-icon>
            <p class="kong-cont-title">暂无部门管理</p>
            <p class="kong-cont-text">请先新增部门</p>
            <div>
              <Button type="primary" @click="getAddTreeFirst">立即添加</Button>
            </div>
          </div>
        </template>
        <!-- 总公司信息 -->
        <template v-if="pageFlag === -1 ">
          <div class="kong-cont">
            <g-icon class="icon-large" name="kongzhuangtai"></g-icon>
            <p class="kong-cont-title">{{flagConName}}</p>
            <div></div>
          </div>
        </template>
        <!-- 查看信息 -->
        <template v-if="pageFlag === 1">
          <div class="right">
            <div class="info-content">
              <div class="info-title">
                部门/分公司信息
                <Badge v-if="companyInfo.hasEnable" class="badge" color="#c5c8ce" text="已停用" />
              </div>
              <div style="position:relative">
                <details-list layout="vertical">
                  <template v-if="companyInfo.hasEnable">
                     <details-list-item label="名称">{{ companyInfo.departmentName }}</details-list-item>
                  </template>
                  <template v-else>
                    <details-list-item label="名称">{{ companyInfo.departmentName }}</details-list-item>
                  </template>
                  <details-list-item label="是否是法务实体">
                     {{ companyInfo.hasForensic ? '是' : '否' }}
                  </details-list-item>
                  <template v-if="companyInfo.hasForensic">
                    <details-list-item label="分公司法定名称">{{ companyInfo.companyName === null ? '--' : companyInfo.companyName}}</details-list-item>
                    <details-list-item label="社会统一信用代码">{{ companyInfo.usiCode === null ? '--' : companyInfo.usiCode}}</details-list-item>
                    <details-list-item label="纳税人识别号">{{ companyInfo.taxCode === null ? '--' : companyInfo.taxCode}}</details-list-item>
                    <details-list-item label="分公司注册地域">{{ companyInfo.region === null ? '--' : companyInfo.region}}</details-list-item>
                    <details-list-item label="详细地址">{{ companyInfo.regionAddress === null ? '--' : companyInfo.regionAddress}}</details-list-item>
                  </template>
                </details-list>
                  <template v-if="companyInfo.hasEnable">
                    <Button type="primary" @click="stopDepartmentOK(0)">启用</Button>
                  </template>
                  <template v-else>
                    <Button type="primary" @click="updateDep">修改</Button>
                    <Button class="btn" @click="stopDepartmentOK(1)">停用</Button>
                  </template>
                <!-- <Spin size="large" fix v-if="spinShow"></Spin> -->
              </div>
            </div>
          </div>
        </template>
        <!-- 修改/新增 -->
        <template v-if="pageFlag === 2">
          <div class="right">
            <span class="info-content">
              <div class="info-title">{{companyTitle}}</div>
              <Form
                ref="companyInfo"
                :model="companyInfo"
                :rules="ruleValidate"
                label-position="top"
                style="width: 100%;"
              >
                <FormItem label="名称" prop="departmentName">
                  <Input
                    v-model="companyInfo.departmentName"
                    placeholder="请输入名称，不超过32字符"
                    style="max-width:300px;"
                  ></Input>
                </FormItem>

                <FormItem label="是否是法务实体" prop="hasForensic">
                  <div slot="label" class="form-label-slot">
                    是否是法务实体
                    <Tooltip content="法务实体需要填写法务信息" placement="top">
                        <Icon type="ios-information-circle-outline" size="16" />
                    </Tooltip>
                  </div>
                  <a-radio-group v-model="companyInfo.hasForensic" >
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                  </a-radio-group>
                </FormItem>
                <template v-if="companyInfo.hasForensic">
                  <FormItem label="分公司法定名称" prop="companyName">
                    <Input
                      v-model="companyInfo.companyName"
                      placeholder="请输入分公司法定名称，不超过64字符"
                      style="max-width:300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="社会统一信用代码" prop="usiCode">
                    <Input
                      v-model="companyInfo.usiCode"
                      placeholder="请输入18位社会统一信用代码"
                      style="max-width:300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="纳税人识别号" prop="taxCode">
                    <Input
                      v-model="companyInfo.taxCode"
                      placeholder="请输入纳税人识别号"
                      style="max-width:300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="分公司注册地域" prop="regionId">
                    <areaCascader
                      class="group-area"
                      :regionList="addressDataForm"
                      :defaultSelected="defaultAddressForm"
                      @getSelectData="getSelectAddressDataForm"
                      style="max-width:300px"
                    />
                  </FormItem>
                  <FormItem label="详细地址" prop="regionAddress">
                    <Input
                      v-model="companyInfo.regionAddress"
                      placeholder="请输入分公司注册详细地址"
                      style="max-width:300px"
                    ></Input>
                  </FormItem>
                </template>
                <FormItem>
                  <Button type="primary" @click="sureUpdate">提交</Button>
                  <Button v-if="addBtnShow" @click="returnButton" class="btn">取消</Button>
                </FormItem>
              </Form>
            </span>
          </div>
        </template>
      </div>
    </Card>
  </div>
</template>

<script>
import Icons from '_cp/icons'
import areaCascader from '_cp/area-cascader'
import elTree from '_cp/el-tree'
import { listConvertTree } from '@/libs/util.js'
import DetailsList from '_cp/details-list'
import {
  getDepartmentList,
  getDepartmentInfo,
  insertOrUpdateDepartmentInfo,
  existDepartmentInfo,
  hasEnableDepartment,
  getRegionList
} from '@/api/department-manage'
const DetailsListItem = DetailsList.Item

export default {
  name: 'DepartmentManage',
  components: {
    elTree,
    areaCascader,
    'g-icon': Icons,
    'details-list': DetailsList,
    'details-list-item': DetailsListItem
  },
  data () {
    // 同级部门
    const validateSameDep = (rule, value, callback) => {
      if (value.length > 32) {
        return callback(new Error('输入名称不超过32个字符'))
      }
      if (value.length === 0) {
        return callback(new Error('部门/分公司名称不能为空'))
      }
      this.getCompanyNameOnly().then(function (existsId) {
        if (existsId) {
          callback(new Error('名称已经存在，请重新输入'))
        } else {
          callback()
        }
      })
    }
    const validateCity = (rule, value, callback) => {
      if (!this.companyInfo.regionId || this.companyInfo.regionId === '') {
        callback(new Error('注册地区不能为空'))
      } else {
        callback()
      }
    }
    return {
      // 部门列表
      departmentList: [],
      // tree 相关
      openKey: null, // 选中的项
      openMidkey: null, // 中间变量 记录修改过的值

      // 信息视图
      spinShow: true,
      companyTitle: '部门/分公司信息',

      pageFlag: 1,

      // 新增信息参数
      companyInfo: {},
      ruleValidate: {
        departmentName: [
          { required: true, validator: validateSameDep, trigger: 'blur' }
        ],
        hasForensic: [
          { required: true, message: '是否是法务实体不能为空', type: 'boolean', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '部门/分公司法定名称不能为空', trigger: 'blur'
          },
          { max: 64, message: '部门/分公司法定名称不能超过64个字符', trigger: 'blur' }
        ],
        usiCode: [
          { required: true, message: '社会统一信用代码不允许为空', type: 'string', trigger: 'blur' },
          { max: 32, message: '社会统一信用代码不能超过16个字符', type: 'string', trigger: 'blur' }
        ],
        taxCode: [
          { required: true, message: '纳税人识别号不能为空', type: 'string', trigger: 'blur' },
          { max: 32, message: '纳税人识别号不能超过16个字符', type: 'string', trigger: 'blur' }
        ],
        regionId: [{ required: true, validator: validateCity }],
        regionAddress: [
          { required: true, message: '详细地址不能为空', trigger: 'change' }
        ]
      },
      // 查询信息参数
      getParams: {
        fatherAid: null,
        departmentAid: null
      },
      // 初始视图展示
      flagOne: true,
      addressDataForm: [], // 地址数据
      defaultAddressForm: [0],
      defaultAddress: [],
      // 总公司视图信息
      flagConName: '',
      // 新增视图取消按钮
      addBtnShow: true
    }
  },

  watch: {

  },
  computed: {

  },
  mounted () {
    this.postDepartmentList()
  },
  methods: {
    // 根据公司编码获取部门列表
    async postDepartmentList () {
      const { success, data } = await getDepartmentList()
      if (success) {
        this.departmentList = JSON.parse(JSON.stringify(data))
        // 如果没有分公司 展示添加视图 并且将表单赋值
        if (
          !this.departmentList[0].children &&
          this.departmentList.length <= 1
        ) {
          this.flagOne = true
          this.pageFlag = 0
          this.companyInfo = {
            fatherAid: data[0].departmentAid,
            departmentAid: -1,
            departmentName: data[0].departmentName,
            hasForensic: 1,
            companyName: '',
            usiCode: '',
            taxCode: '',
            regionId: 3,
            regionAddress: ''
          }
        } else {
          this.flagOne = false
          // 如果存在openMidkey 说明不是第一次请求 则把请求参数赋值为中间变量
          if (this.openMidkey) {
            this.getParams.departmentAid = this.openMidkey
          } else if (this.departmentList[0].children) {
            this.getParams.departmentAid = data[0].children[0].departmentAid
            this.openKey = data[0].children[0].departmentAid
            this.getParams.fatherAid = data[0].children[0].fatherAid
          } else {
            this.getParams.departmentAid = data[0].departmentAid
            this.openKey = data[0].departmentAid
            this.getParams.fatherAid = data[0].fatherAid
          }
          this.getDepartmentInfo()
        }
      }
    },

    // 点击树 请求信息视图
    getChooseTree (val) {
      this.openMidkey = null
      this.addBtnShow = true
      this.openKey = val.departmentAid
      if (val.departmentAid !== -1) {
        this.getParams = {
          departmentAid: val.departmentAid,
          fatherAid: val.fatherAid
        }

        this.getDepartmentInfo()
      } else {
        this.flagConName = val.departmentName
        this.pageFlag = -1
      }
    },
    // 根据部门AID和父级AID获取部门信息
    async getDepartmentInfo () {
      this.spinShow = true
      this.pageFlag = 1
      const { success, message, data } = await getDepartmentInfo(
        this.getParams
      )
      if (success) {
        this.spinShow = false
        this.companyInfo = data
        if (this.openMidkey) {
          this.$refs.eltree.setCurrent(this.openMidkey)
          this.openKey = this.openMidkey
        } else {
          this.$refs.eltree.setCurrent(this.openKey)
        }
      } else {
        this.$Message.error(message)
      }
    },
    // 第一次点击新增 切换新增视图
    getAddTreeFirst () {
      this.pageFlag = 2
      this.companyTitle = this.companyInfo.departmentName + '  新增下级'
    },

    // 点击新增 切换新增视图
    getAddTree (val) {
      this.companyInfo = {
        fatherAid: val.departmentAid,
        departmentAid: -1,
        departmentName: '',
        hasForensic: 1,
        companyName: '',
        usiCode: '',
        taxCode: '',
        regionId: 3,
        regionAddress: ''
      }
      this.pageFlag = 2
      this.addBtnShow = false
      this.companyTitle = val.departmentName + '  新增下级'
      // 选中样式
      this.openKey = val.departmentAid
      this.$refs.eltree.setCurrent(val.departmentAid)
    },

    // 点击 修改
    updateDep () {
      this.postListRegionForm()
      this.companyTitle = this.companyInfo.departmentName + ' 修改信息'
      this.pageFlag = 2
      this.companyInfo.departmentAid = this.getParams.departmentAid
      this.companyInfo.fatherAid = this.getParams.fatherAid
      this.defaultAddressForm[0] = this.companyInfo.grandFatherId
      this.defaultAddressForm[1] = this.companyInfo.fatherId
      this.defaultAddressForm[2] = this.companyInfo.regionId
    },

    // 获取表单地址
    async postListRegionForm () {
      const paramsData = {
        regionId: -1
      }
      const { success, data } = await getRegionList(paramsData)
      if (success) {
        this.addressDataForm = listConvertTree(0, data)
      }
    },

    // 接收选择地址 数据
    getSelectAddressDataForm (value, selectedData) {
      if (value.length !== 0) {
        this.companyInfo.regionId = value[2]
      } else {
        this.companyInfo.regionId = null
      }
    },

    // 修改/新增 【校验】同级公司名称唯一
    async getCompanyNameOnly () {
      const { success, data } = await existDepartmentInfo(this.companyInfo)
      if (success) {
        return data.existsId
      }
    },
    // 保存确认
    sureUpdate () {
      this.$refs['companyInfo'].validate(valid => {
        if (valid) {
          this.saveUpdate()
        } else {
          this.pageFlag = 2
          this.$Message.error('请检查填写信息是否正确!')
        }
      })
    },
    // 确定新增/修改部门
    async saveUpdate () {
      const { success, message, data } = await insertOrUpdateDepartmentInfo(this.companyInfo)
      if (success) {
        this.pageFlag = 1
        this.openMidkey = data.departmentAid

        this.postDepartmentList()
        this.$Message.success('操作成功')
      } else {
        this.$Message.error(message)
      }
    },

    // 新增/修改取消
    returnButton () {
      // 判断是否是初始新增视图
      if (!this.flagOne) {
        this.pageFlag = 1
        this.getDepartmentInfo()
      } else {
        this.pageFlag = 0
      }
    },

    // 停用部门确认
    stopDepartmentOK (val) {
      if (val) {
        this.$Modal.confirm({
          title: '停用确认',
          content: '确认停用这个分公司/部门吗？',
          onOk: () => {
            this.stopDepartment()
          }
        })
      } else {
        this.$Modal.confirm({
          title: '启用确认',
          content: '确认启用这个分公司/部门吗？',
          onOk: () => {
            this.stopDepartment()
          }
        })
      }
    },
    // 停用部门
    async stopDepartment () {
      const { success, data, message } = await hasEnableDepartment(this.getParams)
      if (success) {
        this.postDepartmentList()
        this.openMidkey = data.departmentAid
        this.$Message.success('操作成功')
        if (!data.hasEnable) {
          this.$Notice.info({
            title: '该部门/分公司已经停用',
            desc: '你可以继续添加新的分公司/部门信息',
            duration: 10
          })
        } else {
          this.$Notice.success({
            title: '该部门/分公司已经启用',
            desc: '你可以继续编辑分公司/部门信息',
            duration: 10
          })
        }
      } else {
        this.$Message.error(message)
      }
    }
    // isForensicChange () {
    //   // alert(1)
    //   // this.$refs.companyInfo.resetFields()
    // }
  }
}
</script>

<style lang="less" scoped>

.card-overflow {
  overflow: auto;
  margin-bottom: 24px;
}

.info-content{
  padding: 0px 32px;
  width: 100%;
  display: inline-block;
  .info-title{
    margin-bottom: 20px;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
  }

  .btn{
    margin-left: 12px;
  }
}

.left-right-cont {
  display: flex;

  .left {
    min-width: 320px !important;
    width: 320px !important;
  }
  .right {
    width: 100%;
    overflow: hidden;
  }
}

.badge {
  margin-left: 1em;
  font-weight: normal;
  .ivu-badge-status-text{
    font-size: 14px;
    color: #c5c8ce;
  }
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

.form-label-slot{
  display: inline-block;
}

</style>
