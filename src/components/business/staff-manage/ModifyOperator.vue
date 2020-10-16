<template>
    <!-- 员工管理 - 修改相关 -->
    <div>
    <!-- 修改弹窗 -->
    <Modal v-model="staffLoad" :title="modifyTitle" :mask-closable="false">
        <Form
          :label-width="150"
          ref="modifyParams"
          :model="modifyParams"
          :rules="ruleValidate"
          width="600"
        >
          <FormItem label="姓名：" prop="staffName" class="form-item">
            <Input v-model="modifyParams.staffName" placeholder="请输入员工姓名"></Input>
          </FormItem>
          <FormItem label="性别：" prop="sexFlag">
            <a-radio-group v-model="modifyParams.sexFlag" >
              <a-radio :value="true">男</a-radio>
              <a-radio :value="false">女</a-radio>
            </a-radio-group>
          </FormItem>
          <FormItem label="电话：" prop="phone" class="form-item">
            <Input v-model="modifyParams.phone" placeholder="请输入员工电话"></Input>
          </FormItem>
          <FormItem label="身份证号码：" prop="idCode" class="form-item">
            <Input v-model="modifyParams.idCode" placeholder="请输入员工身份证号码"></Input>
          </FormItem>
          <FormItem label="工号：" prop="staffCode" class="form-item">
            <Input v-model="modifyParams.staffCode" placeholder="请输入员工工号"></Input>
          </FormItem>
          <FormItem label="邮箱：" prop="email" class="form-item">
            <Input v-model="modifyParams.email" placeholder="请输入员工邮箱"></Input>
          </FormItem>
          <FormItem class="form-item" label="工资卡开户银行：" prop="bankId">
            <Row>
              <Col span="11">
                <Select v-model="modifyParams.bankId" placeholder="请选择开户银行" transfer>
                  <Option
                    v-for="item in bankList"
                    :value="item.bankId"
                    :key="item.bankId"
                    :label="item.bankName"
                  ></Option>
                </Select>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <Input placeholder="请输入开户行名称" v-model="modifyParams.bankName"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="工资卡账号：" prop="bankCard" class="form-item">
            <Input v-model="modifyParams.bankCard" placeholder="请输入工资卡账号"></Input>
          </FormItem>
        </Form>
        <div slot="footer" class="footer-button">
          <Button type="text" @click="cancel">取消</Button>
          <Button type="primary" @click="okModify" class="save-btn">保存</Button>
        </div>
      </Modal>

      <!-- 调整部门 -->
      <Modal v-model="adjustDepLoad" title="调整部门" :mask-closable="false">
        <Form
          :label-width="130"
          ref="adjustDepParams"
          :model="adjustDepParams"
          :rules="ruleValidateDep"
          width="600"
        >
          <FormItem label="员工：" class="form-item">{{staffName}}</FormItem>
          <FormItem label="当前部门：" class="form-item">{{staffDep}}</FormItem>
          <FormItem class="form-item">
            <Icon type="md-repeat" size="30" style="transform: rotate(90deg);" />
          </FormItem>
          <FormItem class="form-item" label="调整部门：" prop="departmentAid">
            <Select
              v-model="adjustDepParams.departmentAid"
              placeholder="输入部门名称搜索"
              transfer
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <Option
                v-for="item in canTransDepList"
                :value="item.departmentAid"
                :key="item.departmentAid"
                :label="item.departmentCode + ' ' + item.departmentName"
              >
                <span>{{item.departmentName}}</span>
                <span style="float:right;color:#ccc">{{item.departmentCode}}</span>
              </Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer" class="footer-button">
          <Button type="text" @click="adjustDepLoad = false">取消</Button>
          <Button type="primary" @click="okModifyDep" class="save-btn">保存</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
import {
  getStaffInfo,
  insertOrUpdateStaffInfo,
  getCanAdjustDepartmentList,
  adjustStaffDepartment,
  getBankList
} from '@/api/staff-manage'
export default {
  name: 'ModifyOperator',
  data () {
    return {
      // 模态框
      bankList: [],
      modifyTitle: '修改',
      staffLoad: false,
      modifyParams: {},
      ruleValidate: {
        staffName: [
          { required: true, message: '员工姓名不能为空', trigger: 'blur' }
        ],
        sexFlag: [
          { required: true, type: 'boolean', message: '员工性别不能为空', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '员工手机号码不能为空', trigger: 'blur' }
        ],
        idCode: [
          { required: true, message: '员工身份证号不能为空', trigger: 'blur' }
        ]
      },
      btnShow: false,

      // 调整部门
      adjustDepLoad: false,
      staffName: '',
      staffAid: '',
      staffDep: '',
      canTransDepList: [],
      adjustDepParams: {
        departmentAid: ''
      },
      ruleValidateDep: {
        departmentAid: [
          { required: true, type: 'number', message: '调整部门不能为空', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    // 打开模态框
    openAppened (val, depAid) {
      this.getBankList()
      if (val !== -1) {
        let params = {
          staffAid: val.staffAid
        }
        this.modifyTitle = '修改'

        this.postStaffInfo(params)
      } else {
        this.modifyTitle = '新增'
        this.modifyParams = {
          staffAid: -1,
          staffName: '',
          sexFlag: true,
          phone: '',
          staffCode: '',
          idCode: '',
          email: '',
          bankId: '',
          bankName: '',
          bankCard: ''
        }
      }
      this.staffLoad = true
    },
    // 获取员工信息
    async postStaffInfo (Params) {
      const { success, message, data } = await getStaffInfo(Params)
      if (success) {
        this.modifyParams = { ...data }
      } else {
        this.$Message.error(message)
      }
    },
    // 获取银行
    async getBankList () {
      const { success, data } = await getBankList()
      if (success) {
        this.bankList = { ...data }
      }
    },
    // 新增修改
    async sureUpdateModify () {
      const { success, message } = await insertOrUpdateStaffInfo(this.modifyParams)
      if (success) {
        this.getStaffInfoList()
        this.staffLoad = false
        this.$Message.success('操作成功')
      } else {
        this.$Message.error(message)
      }
    },
    // 确认新增修改
    okModify () {
      this.$refs['modifyParams'].validate(valid => {
        if (valid) {
          this.sureUpdateModify()
        } else {
          this.staffLoad = true
          this.$Message.error('请检查填写信息是否正确!')
        }
      })
    },

    // 打开调整部门
    openAdjustDep (row) {
      this.adjustDepLoad = true
      this.staffName = row.staffName
      this.staffAid = row.staffAid
      this.staffDep = row.departmentCode
      this.adjustDepParams.departmentAid = ''
    },
    // 获取可转移部门列表
    async remoteMethod (query) {
      this.loading = true
      const { success, message, data } = await getCanAdjustDepartmentList(query)
      if (success) {
        this.loading = false
        this.canTransDepList = data.filter(
          item =>
            item.departmentName.toLowerCase().indexOf(query.toLowerCase()) > -1
        )
      } else {
        this.$Message.error(message)
      }
    },
    // 转移
    async sureUpdateModifyDep () {
      let params = {
        departmentAid: this.adjustDepParams.departmentAid,
        staffAid: this.staffAid
      }
      const { success, message } = await adjustStaffDepartment(params)
      if (success) {
        this.getStaffInfoList()
        this.adjustDepLoad = false
        this.$Message.success('操作成功')
      } else {
        this.$Message.error(message)
      }
    },
    // 确认调整部门
    okModifyDep () {
      this.$refs['adjustDepParams'].validate(valid => {
        if (valid) {
          this.sureUpdateModifyDep()
        } else {
          this.adjustDepLoad = true
          this.$Message.error('请检查填写信息是否正确!')
        }
      })
    },
    // 关闭模态框
    cancel () {
      this.staffLoad = false
      this.$refs['modifyParams'].resetFields()
      this.getStaffInfoList()
    },
    getStaffInfoList () {
      this.$emit('getStaffInfoList')
    }

  }
}
</script>

<style lang="less" scoped>

</style>
