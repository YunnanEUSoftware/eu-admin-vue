<template>
  <Layout class="login-layout">
    <Header class="header-home">
      <div class="header-flex">
        <div class="header-img">
          <img :src="companyInfo.platformLogoUrl" />
        </div>
        <div class="header-title">
          <div class="header-title-zn">{{companyInfo.platformName}}</div>
          <div class="header-title-english">{{companyInfo.platformNameEnglish}}</div>
        </div>
      </div>
    </Header>
    <Content class="content">
      <div class="carouse-content">
        <!-- 登录框 -->
        <div class="login-content-panel">
          <Tabs value="staff-login">
            <!-- 登录 -->
            <TabPane label="登录"
                     name="staff-login">
              <Form ref="formStaffLogin"
                    :model="formStaffLogin"
                    :rules="formStaffLoginRule">
                <FormItem prop="phone">
                  <Input size="large"
                         placeholder="请输入手机号"
                         autocomplete="on"
                         v-model="formStaffLogin.phone" />
                </FormItem>
                <FormItem prop="loginKey">
                  <Input size="large"
                         type="password"
                         placeholder="请输入登录密码"
                         autocomplete="on"
                         v-model="formStaffLogin.loginKey" />
                </FormItem>
                <FormItem prop="imageCode">
                  <Row>
                    <Col :span="16">
                    <Input size="large"
                           placeholder="请输入图片验证码"
                           autocomplete="on"
                           v-model="formStaffLogin.imageCode" />
                    </Col>
                    <Col :span="7"
                         :offset="1">
                    <img @click="getImageCaptchaPicture"
                         :src="imageCodeUrl"
                         alt="图片"
                         style="display: inline-block; width: 100%;">
                    </Col>
                  </Row>
                </FormItem>
              </Form>
              <Row class="check-row">
                <Col span="12">
                <Checkbox v-model="rememberKey">记住密码</Checkbox>
                </Col>
                <Col span="12">
                <a href="#"
                   style="float: right;"
                   @click="openForgetKeyModal">忘记密码</a>
                </Col>
              </Row>
              <div>
                <Button size="large"
                        type="primary"
                        long
                        @click="getLogin('formStaffLogin')"
                        :loading="buttonLoading">登录</Button>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <!-- 轮播 -->
        <Carousel :autoplay="setting.autoplay"
                  :dots="setting.dots"
                  :autoplay-speed="setting.autoplaySpeed"
                  :trigger="setting.trigger"
                  :arrow="setting.arrow"
                  v-model="setting.carouselitme"
                  loop>
          <CarouselItem v-for="(item, index) in companyInfo.imagesUrlList"
                        :key="index">
            <div class="item-carousel">
              <img class="item-img"
                   :src="item.imagesUrl"
                   alt
                   srcset />
            </div>
          </CarouselItem>
        </Carousel>
      </div>
    </Content>
    <Footer class="layout-footer-center login-footer">
      <a class="footer-alink"
         href="#">彩云人力资源服务SaaS技术支持</a>
      <a class="footer-alink"
         href="#">云南易用软件有限公司 © 版权所有</a>
    </Footer>

    <!-- 模态框找回密码 -->
    <Modal v-model="forgetKeyModal"
           title="忘记密码"
           width="500px"
           footer-hide
           :mask-closable="false">
      <div class="model-form">
        <Form ref="forgetPsw"
              :model="forgetPswData"
              :rules="forgetPswRule">
          <FormItem prop="phone">
            <Input size="large"
                   placeholder="请输入手机号"
                   autocomplete="on"
                   v-model="forgetPswData.phone" />
          </FormItem>
          <FormItem prop="imageCode">
            <Row>
              <Col :span="16">
              <Input size="large"
                     placeholder="请输入图片验证码"
                     autocomplete="on"
                     v-model="forgetPswData.imageCode" />
              </Col>
              <Col :span="7"
                   :offset="1">
              <img @click="getImageCaptchaPicture"
                   :src="forGetImageCodeUrl"
                   alt="图片"
                   style="display: inline-block; width: 100%;">
              </Col>
            </Row>
          </FormItem>
          <FormItem prop="messageCode">
            <Row>
              <Col :span="11">
              <Input size="large"
                     placeholder="请输入短信验证码"
                     autocomplete="on"
                     v-model="forgetPswData.messageCode" />
              </Col>
              <Col :span="12"
                   :offset="1">
              <Button style="width: 100%;"
                      :loading="timing !== 0"
                      @click="sendPhoneCode('forgetPsw')">{{ sendPhoneCodeMsg }}</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem prop="loginKey">
            <Input size="large"
                   type="password"
                   placeholder="请输入6-12位数字字母组合密码"
                   autocomplete="on"
                   v-model="forgetPswData.loginKey" />
          </FormItem>
          <FormItem prop="loginKeyAgain">
            <Input size="large"
                   type="password"
                   placeholder="请再次输入密码"
                   autocomplete="on"
                   v-model="forgetPswData.loginKeyAgain" />
          </FormItem>
          <div class="public-modal-btn">
            <Button type="primary"
                    :loading="btLoading"
                    @click="sureResetPsw('forgetPsw')">确认</Button>
            <Button type="default"
                    @click="forgetKeyModal = false">取消</Button>
          </div>
        </Form>
      </div>
    </Modal>

  </Layout>
</template>

<script>
import { postLogin, postGetImageCode, postGetMessageCode, postUpdateLoginKey } from '@/api/login'
export default {
  data () {
    return {
      // 轮播图控制
      setting: {
        carouselitme: 0,
        autoplay: false,
        autoplaySpeed: 3000,
        dots: 'none',
        trigger: 'hover',
        arrow: 'never'
      },
      // TODO 地址信息 初始信息
      companyInfo: {
        platformLogoUrl: 'https://eu-static.obs.cn-north-1.myhuaweicloud.com/chrsaas/cloud-hro/logo.png', // logo地址
        platformName: '基础平台管理系统', // 平台名称
        platformNameEnglish: 'EU-Admin-Cli', // 平台名称英文
        mission: '提高易用前端开发流程', // 使命
        missionEnglish: '',
        imagesUrlList: [
          {
            imagesUrl: 'https://eu-static.obs.cn-north-1.myhuaweicloud.com/chrsaas/cloud-hro/33.jpg'
          }
        ]
      },
      // 按钮加载中控制
      buttonLoading: false,

      imageCodeUrl: '',
      forGetImageCodeUrl: '',
      // 【登录】
      formStaffLogin: {
        phone: '', // 手机号或邮箱
        loginKey: '', // 登录密码
        imageCodeKey: '', // 图片验证码key
        imageCode: '' // 图片验证码
      },
      // 记住密码 TODO 记住密码
      rememberKey: false,
      // 【登录】校验规则
      formStaffLoginRule: {
        phone: [
          { required: true, message: '手机号不允许为空', trigger: 'change' }
        ],
        loginKey: [
          // 判空
          { required: true, message: '登录密码不允许为空', trigger: 'change' },
          // 登录密码由6-12位数字、字母组成
          {
            type: 'string',
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
            message: '登录密码为6-12位数字字母组合',
            trigger: 'change'
          }
        ],
        imageCode: [
          { required: true, message: '图片验证码不允许为空', trigger: 'change' }
        ]
      },

      // 模态框-忘记密码
      forgetKeyModal: false,
      btLoading: false,
      forgetPswData: {
        phone: '', // 手机号或邮箱
        imageCode: '',
        imageCodeKey: '',
        messageCode: '', // 短信验证码
        loginKey: '',
        loginKeyAgain: ''
      },
      forgetPswRule: {
        phone: [
          { required: true, message: '手机号不允许为空', trigger: 'change' }
        ],
        imageCode: [
          { required: true, message: '图片验证码不允许为空', trigger: 'change' }
        ],
        messageCode: [
          { required: true, message: '短信验证码不允许为空', trigger: 'change' }
        ],
        loginKey: [
          // 判空
          { required: true, message: '登录密码不允许为空', trigger: 'change' },
          // 登录密码由6-12位数字、字母组成
          {
            type: 'string',
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
            message: '登录密码为6-12位数字字母组合',
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (this.forgetPswData.loginKeyAgain !== '') {
                this.$refs.forgetPsw.validateField('loginKeyAgain')
              }
              callback()
            }
          }
        ],
        loginKeyAgain: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.forgetPswData.loginKeyAgain === this.forgetPswData.loginKey) {
                callback()
              } else {
                callback(new Error('两次输入不一致'))
              }
            }
          }
        ]
      },

      timing: 0,
      sendPhoneCodeMsg: '获取验证码'
    }
  },
  created () {
    // 获取图片验证码
    this.getImageCaptchaPicture()
  },
  /**
   * 实例初始化完成后初始化页面
   */
  mounted () {
  },
  // 实例挂载前清除缓存
  beforeCreate () {
    window.sessionStorage.clear()
  },
  computed: {

  },
  methods: {
    // 工作人员登录请求
    async poststaffLogin () {
      // 开启图标加载动画
      this.buttonLoading = true
      const { success, data } = await postLogin(this.formStaffLogin)
      if (success) {
        // 将token存储到localstore中
        this.$store.commit('updateToken', data.token)
        // TODO 记住密码【存储到cookie】
        // 关闭加载动画
        this.buttonLoading = false

        // 跳转到首页
        this.$router.push({ name: 'departmentManage' })
        this.buttonLoading = false
      } else {
        this.buttonLoading = false
        this.formStaffLogin.imageCode = ''
      }
    },
    // 工作人员登录按钮
    getLogin (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.poststaffLogin()
        } else {
          this.$Message.error('请检查你填写的内容')
        }
      })
    },

    // 获取验证码
    async getImageCaptchaPicture () {
      const { success, data } = await postGetImageCode()
      if (success) {
        this.imageCodeUrl = data.imageCode
        this.formStaffLogin.imageCodeKey = data.imageCodeKey
        // 获取验证码后清空验证码信息
        this.formStaffLogin.imageCode = ''
      }
    },

    // 获取验证码-找回密码
    async getImageCaptchaPictureToForget () {
      const { success, data } = await postGetImageCode()
      if (success) {
        this.forGetImageCodeUrl = data.imageCode
        this.forgetPswData.imageCodeKey = data.imageCodeKey
        // 获取验证码后清空验证码信息
        this.forgetPswData.imageCode = ''
      }
    },

    /**
     * 打开模态框【初始化数据】
     */
    openForgetKeyModal () {
      this.getImageCaptchaPictureToForget()
      this.forgetKeyModal = true
    },

    // 确定重置密码
    sureResetPsw (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let params = {
            phone: this.forgetPswData.phone,
            messageCode: this.forgetPswData.messageCode,
            loginKey: this.forgetPswData.loginKey
          }
          // 重置密码接口
          const { success } = await postUpdateLoginKey(params)
          if (success) {
            this.$Message.success('重置成功')
            this.forgetKeyModal = false
          }
        } else {
          this.$Message.error('请检查你填写的内容')
        }
      })
    },

    // 发送短信验证码
    sendPhoneCode (name) {
      this.$refs[name].validateField('imageCode')
      this.$refs[name].validateField('phone', async (errorStr) => {
        if (errorStr === '' && this.forgetPswData.imageCode !== '') {
          let params = {
            phone: this.forgetPswData.phone,
            imageCode: this.forgetPswData.imageCode,
            imageCodeKey: this.forgetPswData.imageCodeKey
          }
          const { success } = await postGetMessageCode(params)
          if (success) {
            // 开启倒计时
            this.timing = 60
            this.sendPhoneCodeMsg = this.timing + 's后再次发送'
            let theCountdown = setInterval(() => {
              this.timing--
              this.sendPhoneCodeMsg = this.timing + 's后再次发送'
              if (this.timing === 0) {
                this.sendPhoneCodeMsg = '获取验证码'
                clearInterval(theCountdown)
              }
            }, 1000)
          }
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
@import "./Login.less";
</style>
