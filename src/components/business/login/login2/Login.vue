<template>
  <div class="login">

    <div class="login-bg">
      <!-- <img :src="loginbg"> -->
    </div>

    <div class="login-con">
      <Card style="height: 100%;border-radius: 10px;"
            :padding="0"
            :bordered="false"
            dis-hover>
        <Row type="flex"
             align="middle"
             justify="center">
          <Col span="12">
          <div class="login-con-img">
            <!-- <img :src="loginimg"> -->
            <span>Basic Login Design Playform</span>
          </div>
          </Col>
          <Col span="12"
               v-if="showNumber === 1">
          <Row class="form-con">
            <Col span="20">
            <Row class="form-con-title">
              <Col span="16">
              <h2 style="color: rgb(41, 41, 124)">基础平台登录</h2>
              </Col>
              <Col span="8">
              <Row>
                <Col span="12"
                     :class="isLogin ? 'form-con-login-active' : 'form-con-login'">
                <span @click="isLogin = true">登录</span>
                </Col>
                <Col span="12"
                     :class="!isLogin ? 'form-con-reg-active' : 'form-con-reg'">
                <span @click="isLogin = false">注册</span>
                </Col>
              </Row>
              </Col>
            </Row>
            </Col>
            <Col span="20"
                 style="margin-top: 24px">
            <LoginForm v-if="isLogin"
                       ref="loginFormRef"
                       @transmitShowforgetKey="showNumber = 2" />
            <Registered v-else
                        @transmitHideforgetKey="showNumber = 1" />
            </Col>
          </Row>
          </Col>
          <Col span="12"
               v-if="showNumber === 2">
          <Row class="form-con">
            <Col span="20">
            <Row class="form-con-title">
              <Col span="16">
              <h2 style="color: rgb(41, 41, 124)">忘记密码</h2>
              </Col>
            </Row>
            </Col>
            <Col span="20"
                 style="margin-top: 24px">
            <ForgetKey @transmitHideforgetKey="showNumber = 1" />
            </Col>
          </Row>

          </Col>
        </Row>
      </Card>
    </div>
    <!-- <Header class="header">
      <Row class="header-row">
        <Col span="1"
             style="width: 70px">
        <img class="header-img"
             :src="logo">
        </Col>
        <Col span="10">
        </Col>
      </Row>
    </Header>

    <Footer class="footer">云南易用软件有限公司 ©版权所有</Footer> -->
  </div>
</template>

<script>
import logo from '@/assets/images/logo.png'
import loginbg from '@/assets/images/login.jpg'
import loginimg from '@/assets/images/login_img.png'
import LoginForm from './login-form'
import Registered from './registered'
import ForgetKey from './forget-key-form'
export default {
  name: 'Login',
  components: {
    LoginForm,
    Registered,
    ForgetKey
  },
  data () {
    return {
      logo,
      loginbg,
      loginimg,
      showNumber: 1,
      isLogin: true
    }
  },

  methods: {

  }
}
</script>
<style lang="less" scoped>
@import "./login.less";
</style>
