<template>
  <Layout class="login">
    <Header>
      <div class="header">
        <div>
          <img :src="staffLogo"
               alt />
        </div>
        <div class="text-content">
          <div class="title">基本登录平台</div>
          <div class="description">推进公司开发进程</div>
        </div>
      </div>
    </Header>
    <Content class="content">
      <Tabs active-key="key1"
            :animated='false'>
        <TabPane label="密码登录"
                 name="name1">
          <Form ref="formLogin"
                :model="formLogin"
                :rules="ruleInline">
            <FormItem prop="phoneNumber">
              <Input type="text"
                     v-model.trim="formLogin.phoneNumber"
                     placeholder="手机号">
              <Icon type="ios-person-outline"
                    slot="prefix"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password"
                     password
                     v-model.trim="formLogin.password"
                     placeholder="密码"
                     @on-enter="handleSubmit('formLogin')">
              <Icon type="ios-lock-outline"
                    slot="prefix"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <div style="display: flex;justify-content: space-between;">
                <Checkbox v-model="single"
                          @on-change="checkChange">记住密码</Checkbox>
                <Button style="padding: 0"
                        @click="showForGet = true"
                        type="text"
                        ghost>忘记密码</Button>
              </div>
              <Button style="width: 100%"
                      type="primary"
                      :loading="loadingBt"
                      @click="handleSubmit('formLogin')">登录</Button>
              <!-- <t-captcha ref="TCaptcha"></t-captcha> -->
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="验证码登录"
                 name="name2">
          <Form ref="formLoginCode"
                :model="formLoginCode"
                :rules="ruleInlineCode">
            <FormItem prop="phoneNumber">
              <Input type="text"
                     v-model.trim="formLoginCode.phoneNumber"
                     placeholder="手机号">
              <Icon type="ios-person-outline"
                    slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="verificationCode">
              <Input type="text"
                     v-model.trim="formLoginCode.verificationCode"
                     placeholder="验证码">
              <Icon type="ios-lock-outline"
                    slot="prepend"></Icon>
              <Button v-if="!sendMsgDisabled"
                      @click="getCode"
                      style="color: #2d8cf0"
                      slot="append"
                      type="dashed">发送验证码</Button>
              <Button v-if="sendMsgDisabled"
                      style="color: #2d8cf0"
                      slot="append"
                      type="dashed">{{codeTime+'秒后获取'}}</Button>
              </Input>
              <!-- <t-captcha ref="TCaptchacode"></t-captcha> -->
            </FormItem>
            <FormItem>
              <Button style="width: 100%"
                      type="primary"
                      :loading="loadingBt"
                      @click="handleSubmit('formLoginCode')">登录</Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Content>
    <Footer>
      <div class="link">
        <a href="#">EU Admin</a>
      </div>
      <div class="copyright">Copyright © 2020 EU Admin</div>
    </Footer>

    <!-- 忘记密码 -->
    <Modal v-model="showForGet"
           width="880"
           footer-hide
           :mask-closable="false">
      <template slot="header"
                class="public-modal-header">
        <span>找回密码</span>
      </template>
      <Steps :current="current">
        <Step title="确认手机号"></Step>
        <Step title="重置密码"></Step>
        <Step title="找回完成"></Step>
      </Steps>
      <div style="margin-top: 64px;text-align: center">
        <div v-if="current === 0">
          <Form ref="forgetRef"
                :model="forgetForm">
            <FormItem label="手机号"
                      prop="phoneNumber"
                      :rules="{ required: true, type: 'string', message: '手机号不能为空', trigger: 'change' }">
              <Input v-model.trim="forgetForm.phoneNumber"
                     placeholder="请输入手机号">
              </Input>
            </FormItem>
            <FormItem class="next-btn">
              <div class="public-modal-btn">
                <Button type="primary"
                        @click="nextOne('forgetRef')">下一步</Button>
                <Button type="default"
                        @click="showForGet = false">取消</Button>
              </div>
            </FormItem>
          </Form>
        </div>
        <div v-if="current === 1">
          <Form ref="forgetRef"
                :model="forgetForm"
                :rules="forgetRule">

            <FormItem label="验证码"
                      prop="verificationCode">
              <Input type="text"
                     v-model.trim="forgetForm.verificationCode"
                     maxlength="6"
                     placeholder="请输入短信验证码">
              </Input>
            </FormItem>
            <FormItem v-show="false">
              <Input type="password"
                     password
                     style="display: none">
              </Input>
            </FormItem>
            <FormItem label="密码"
                      prop="loginKey">
              <Input type="password"
                     password
                     v-model.trim="forgetForm.loginKey"
                     placeholder="请输入密码">
              </Input>
            </FormItem>
            <FormItem label="确认密码"
                      prop="loginKeyAgain">
              <Input type="password"
                     password
                     v-model.trim="forgetForm.loginKeyAgain"
                     placeholder="请确认密码">
              </Input>
            </FormItem>
            <FormItem class="next-btn">
              <div class="public-modal-btn">
                <Button type="primary"
                        @click="nextTwo('forgetRef')">下一步</Button>
                <Button type="default"
                        @click="showForGet = false">取消</Button>
              </div>
            </FormItem>
          </Form>
        </div>
        <div v-if="current === 2">
          <Icon type="md-checkmark-circle"
                size="80"
                color="#19be6b" />
          <h2>重置成功</h2>
          <div style="margin-top: 48px">
            <Button style="padding: 0"
                    @click="showForGet = false"
                    type="text"
                    ghost>点击返回登录</Button>
          </div>
        </div>
      </div>
      <!-- <Button type="primary" @click="next">Next step</Button> -->
    </Modal>

  </Layout>
</template>

<script>
// import TCaptcha from '@/components/public/t-captcha'
import staffLogo from '@/assets/images/original.png'
import { loginByKey, sendPhoneMsg, loginByPhoneMsg, resetPsw } from '@/api/login'
// import { login } from '@/api/login/login'

export default {
  // components: {TCaptcha,},
  data () {
    const validatePass = (rule, value, callback) => {
      if (!/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{2,}$/.test(value)) {
        return callback(new Error('请输入数字字母组合密码'))
      }
      if (value.length > 32) {
        return callback(new Error('密码不能超过32个字符'))
      }
      if (value.length < 6) {
        return callback(new Error('密码需要大于6个字符'))
      }
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateAgainNewKey = (rule, value, callback) => {
      if (this.forgetForm.loginKeyAgain === '') {
        callback(new Error('请再次输入新密码'))
      } else if (this.forgetForm.loginKeyAgain !== this.forgetForm.loginKey) {
        callback(new Error('两次输入不一致'))
      } else {
        callback()
      }
    }
    return {
      // TODO 变为null
      current: 0,
      showForGet: false,
      oneLoading: false,
      twoLoading: false,
      loadingBt: false,
      staffLogo,
      single: false,
      formLogin: {
        phoneNumber: '',
        password: '',
        ticket: '',
        randStr: '',
        ipAddress: '',
        clientCode: '123465'
      },
      formLoginCode: {
        phoneNumber: '',
        verificationCode: '',
        ipAddress: '',
        clientCode: '123465'
      },
      ruleInline: {
        phoneNumber: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass },
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      },
      ruleInlineCode: {
        phoneNumber: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ],
        verificationCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      },
      forgetForm: {
        phoneNumber: '',
        verificationCode: '',
        loginKey: '',
        loginKeyAgain: ''
      },
      forgetRule: {
        verificationCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
        loginKey: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          {
            type: 'string',
            min: 6,
            max: 32,
            message: '请输入 6 - 32 新密码',
            trigger: 'change'
          }
        ],
        loginKeyAgain: [
          { required: true, validator: validateAgainNewKey, trigger: 'change' }
        ]
      },
      codeTime: 59, // 发送验证码倒计时
      sendMsgDisabled: false // 是否显示获取验证码按钮
    }
  },
  watch: {
    current () {
      if (this.current === 2) {
        // this.findSuccessCount()
      }
    },
    showForGet () {
      if (!this.showForGet) {
        this.current = 0
      }
    }
  },
  // 实例挂载前清除缓存
  beforeCreate () {
  },
  created () {
  },
  /**
   * 实例初始化完成后初始化页面
   */
  mounted () {
  },
  methods: {
    // 密码登录
    async loginByKey () {
      this.loadingBt = true
      let params = {
        ...this.formLogin
        // TODO
      }
      const { success, data } = await loginByKey(params)
      if (success) {
        try {
          if (this.single) {
            window.customBattleService.savePwd(JSON.stringify({ phoneNumber: this.formLogin.phoneNumber, password: this.formLogin.password }))
          } else {
            window.customBattleService.savePwd(JSON.stringify({ phoneNumber: this.formLogin.phoneNumber, password: '' }))
          }
          window.customBattleService.saveToken(data.token)
        } catch (error) {
          // console.log(error)
          if (process.env.VUE_APP_NODE_CONFIG !== 'prod') {
            this.$Notice.error({ title: '错误信息', desc: error, duration: 0 })
          }
        }
        this.$store.commit('updateToken', data.token)
        window.sessionStorage.name = data.name
        window.sessionStorage.iconFileUrl = data.iconFileUrl
        this.loadingBt = false
        if (data.isNeedApply) {
          this.$refs.applyModal.openUpdate(this.formLogin)
        } else {
          // 请求权限并跳转路由
          this.$store.dispatch('getMenuData', true).then(res => {
            let routes = this.$store.state.app.menuRspList
            if (routes && routes.length > 0 && routes[0].children && routes[0].children.length > 0) {
              let name = routes[0].children[0].name
              // 配置首页name
              this.$config.homeName = name
              // 跳到第一个
              this.$router.push({ name })
            } else {
              this.$Message.warning('该用户无任何权限，请联系管理员分配权限后再次登录')
            }
          })
        }
      }
      this.loadingBt = false
    },
    // 获取验证码
    async sendPhoneMsg (res) {
      const { success } = await sendPhoneMsg({ phoneNumber: this.formLoginCode.phoneNumber, ticket: res.ticket, randStr: res.randStr })
      if (success) {
        this.$Message.success('发送成功')
        this.sendMsgDisabled = true
        let codeInterval = window.setInterval(() => {
          if ((this.codeTime--) <= 0) {
            this.codeTime = 59
            this.sendMsgDisabled = false
            window.clearInterval(codeInterval)
          }
        }, 1000)
      }
    },
    // 验证码登录
    async loginByPhoneMsg () {
      this.loadingBt = true
      let params = {
        ...this.formLoginCode
        // TODO
      }
      const { success, data } = await loginByPhoneMsg(params)
      if (success) {
        try {
          window.customBattleService.saveToken(data.token)
        } catch (error) {
          // console.log(error)
          if (process.env.VUE_APP_NODE_CONFIG !== 'prod') {
            this.$Notice.error({ title: '错误信息', desc: error, duration: 0 })
          }
        }
        this.$store.commit('updateToken', data.token)
        window.sessionStorage.name = data.name
        window.sessionStorage.iconFileUrl = data.iconFileUrl
        this.loadingBt = false
        if (data.isNeedApply) {
          this.$refs.applyModal.openUpdate(this.formLoginCode)
        } else {
          // 请求权限并跳转路由
          this.$store.dispatch('getMenuData', true).then(res => {
            let routes = this.$store.state.app.menuRspList
            if (routes && routes.length > 0 && routes[0].children && routes[0].children.length > 0) {
              let name = routes[0].children[0].name
              // 配置首页name
              this.$config.homeName = name
              // 跳到第一个
              this.$router.push({ name })
            } else {
              this.$Message.warning('该用户无任何权限，请联系管理员分配权限后再次登录')
              window.sessionStorage.clear()
              this.$router.push({ name: 'login' })
            }
          })
        }
      }
      this.loadingBt = false
    },
    // 登录
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (name === 'formLogin') {
            // this.$refs['TCaptcha'].createCaptcha((data) => {
            // this.formLogin.ticket = data.ticket
            // this.formLogin.randStr = data.randStr
            this.loginByKey()
            // })
          } else {
            this.loginByPhoneMsg()
          }
        } else {
          this.$Message.error('请正确输入账号密码后登录')
        }
      })
    },
    // 发送验证码
    getCode () {
      if (!/^1\d{10}$/.test(this.formLoginCode.phoneNumber)) {
        this.$Message.error('请输入正确的电话号码')
        return
      }
      this.$refs['TCaptchacode'].createCaptcha((data) => {
        this.sendPhoneMsg(data)
      })
    },
    checkChange () { },
    // 忘记密码发送验证码
    async forget (res) {
      this.oneLoading = true
      const { success } = await sendPhoneMsg({ phoneNumber: this.forgetForm.phoneNumber, ticket: res.ticket, randStr: res.randStr })
      if (success) {
        this.oneLoading = false
        this.$Message.success('发送成功')
        this.current = 1
      }
    },
    // 确认账号下一步
    nextOne () {
      if (!/^1\d{10}$/.test(this.forgetForm.phoneNumber)) {
        this.$Message.error('请输入正确的电话号码')
        return
      }
      this.$refs['forgetRef'].validate((valid) => {
        if (valid) {
          this.$refs['TCaptcha'].createCaptcha((data) => {
            this.forget(data)
          })
        }
      })
    },
    // 找回密码请求
    async resetPsw () {
      this.twoLoading = true
      const { success } = await resetPsw(this.forgetForm)
      if (success) {
        this.twoLoading = false
        this.$Message.success('发送成功')
        this.current = 2
      }
    },
    // 重置密码下一步
    nextTwo () {
      this.$refs['forgetRef'].validate((valid) => {
        if (valid) {
          this.resetPsw()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./login.less";
</style>
