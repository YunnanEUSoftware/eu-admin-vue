<template>
  <Form ref="loginForm"
        :model="form"
        :rules="rules"
        @keyup.enter.native="handleSubmit">
    <h2 class="login-title">登录</h2>

    <FormItem prop="phone">
      <Input v-model="form.phone"
             placeholder="请输入用户名">
      <span slot="prepend">
        <Icon :size="18"
              color="#17233d"
              type="ios-person"></Icon>
      </span>
      </Input>
    </FormItem>
    <FormItem prop="loginKey">
      <Input type="password"
             v-model="form.loginKey"
             placeholder="请输入密码">
      <span slot="prepend">
        <Icon :size="18"
              color="#17233d"
              type="md-lock"></Icon>
      </span>
      </Input>
    </FormItem>

    <FormItem style="margin-top: 48px">
      <Button type="primary"
              long
              :loading="submitLoading"
              @click="handleSubmit">登录</Button>
      <!-- <TCaptcha ref="TCaptcha"></TCaptcha> -->
    </FormItem>
    <FormItem>
      <span class="login-bottom-right"
            @click="forgetKey">忘记密码？</span>
    </FormItem>
  </Form>
</template>
<script>
import { login } from '@/api/login'
import config from '@/config'
// import TCaptcha from '@/components/public/t-captcha'
export default {
  name: 'LoginForm',
  // components: { TCaptcha },
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '账号不能为空', trigger: 'change' }]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { message: '密码必须为数字和字母组合(6 ~ 20)', pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/ }
        ]
      }
    }
  },
  data () {
    return {
      isShow: false,
      form: {
        phone: '',
        loginKey: '',
        ticket: '',
        randStr: ''
      },
      submitLoading: false
    }
  },
  computed: {
    rules () {
      return {
        phone: this.userNameRules,
        loginKey: this.passwordRules
      }
    }
  },
  mounted () {

  },
  methods: {
    // 登录
    async handleLogin () {
      this.submitLoading = true
      let { code, data } = await login(this.form)
      if (code === 10000) {
        this.submitLoading = false
        this.$store.commit('setToken', data.token)
        this.$store.commit('setUserName', data.platformCodeName)
        this.$router.push({
          name: config.homeName
        })
      } else {
        this.submitLoading = false
      }
    },

    // 登录
    handleSubmit () {
      // this.$router.push({
      //   name: config.homeName
      // })
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.$refs['TCaptcha'].createCaptcha((data) => {
            this.form.ticket = data.ticket
            this.form.randStr = data.randStr
            this.handleLogin()
          })
        }
      })
    },

    // 设置登录按钮加载状态
    setLoginLoading () {
      this.submitLoading = false
    },

    forgetKey () {
      this.$emit('transmitShowforgetKey')
    }
  }
}
</script>
<style lang="less" scoped>
@import "./login-form.less";
</style>
