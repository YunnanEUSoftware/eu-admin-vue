<!-- 注册 -->
<template>
  <div>
    <Form ref="forgetRef"
          :model="registerForm"
          :rules="forgetRule">
      <FormItem prop="phone">
        <Input v-model.trim="registerForm.phone"
               placeholder="请输入手机号">
        </Input>
      </FormItem>
      <FormItem v-show="false">
        <Input type="password"
               style="display: none">
        </Input>
      </FormItem>
      <FormItem prop="messageCode">
        <Input style="width: 60%"
               v-model.trim="registerForm.messageCode"
               placeholder="请输入 6 位短信验证码">
        </Input>
        <Button style="margin-left: 16px"
                type="primary">获取验证码</Button>
      </FormItem>
      <FormItem prop="loginKey">
        <Input v-model.trim="registerForm.loginKey"
               type="password"
               placeholder="请输入密码">
        </Input>
      </FormItem>
      <FormItem prop="loginKeyAgain">
        <Input v-model.trim="registerForm.loginKeyAgain"
               type="password"
               placeholder="请确认密码">
        </Input>
      </FormItem>
      <div class="next-btn">
        <Button type="primary"
                :loading="twoLoading"
                shape="circle"
                @click="nextTwo">注册</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import {
  postRegisterMessageCode,
  postRegisterKey
} from '@/api/login'
// import TCaptcha from '@/components/public/t-captcha'
export default {
  // components: { TCaptcha },
  data () {
    const validateAgainNewKey = (rule, value, callback) => {
      if (this.registerForm.loginKeyAgain === '') {
        callback(new Error('请再次输入新密码'))
      } else if (this.registerForm.loginKeyAgain !== this.registerForm.loginKey) {
        callback(new Error('两次输入不一致'))
      } else {
        callback()
      }
    }
    return {
      current: 0,
      oneLoading: false,
      twoLoading: false,
      timeCount: 5, // 倒计时 5秒
      registerForm: {
        phone: '',
        messageCode: '',
        loginKey: '',
        loginKeyAgain: '',
        ticket: '',
        randStr: ''
      },
      // 表单验证
      forgetRule: {
        phone: [{ required: true, type: 'string', message: '手机号不能为空', trigger: 'change' }],
        messageCode: [
          { required: true, message: '短信验证码不能为空', trigger: 'change' },
          {
            type: 'string',
            len: 6,
            message: '请输入 6 位短信验证码',
            trigger: 'change'
          }
        ],
        loginKey: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { message: '密码必须为数字和字母组合(6 ~ 20)', pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/ }
        ],
        loginKeyAgain: [
          { required: true, validator: validateAgainNewKey, trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    current () {
      if (this.current === 2) {
        this.findSuccessCount()
      }
    }
  },

  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted () {

  },
  methods: {
    // 获取短信验证码
    async getMessageCode () {
      this.oneLoading = true
      const { code, message } = await postRegisterMessageCode(this.registerForm)
      if (code === 10000) {
        this.oneLoading = false
        this.$Message.success(message)
        this.next()
      } else {
        this.oneLoading = false
      }
    },

    // 设置密码
    async setKey () {
      this.twoLoading = true
      const { code, message } = await postRegisterKey(this.registerForm)
      if (code === 10000) {
        this.next()
        this.$Message.success(message)
        this.twoLoading = false
      } else {
        this.twoLoading = false
      }
    },
    // 确认账号下一步
    nextOne () {
      this.$refs['forgetRef'].validate((valid) => {
        if (valid) {
          this.$refs['TCaptcha'].createCaptcha((data) => {
            this.registerForm.ticket = data.ticket
            this.registerForm.randStr = data.randStr
            this.getMessageCode()
          })
        }
      })
    },

    // 设置密码下一步
    nextTwo () {
      this.$refs['forgetRef'].validate((valid) => {
        if (valid) {
          this.setKey()
        }
      })
    },

    next () {
      this.current += 1
    },
    // 上传失败读秒倒计时
    findSuccessCount () {
      const timer = setInterval(() => {
        if (this.timeCount > 0) {
          this.timeCount--
        } else if (this.timeCount === 0) {
          clearInterval(timer)
          this.backClick()
        }
      }, 1000)
    },
    backClick () {
      this.$emit('transmitHideRegistered')
    }
  }
}
</script>
<style scoped lang='less'>
@import "./registered.less";
</style>
