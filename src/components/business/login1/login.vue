<template>
  <div class="login">

    <div class="login-bg">
      <img :src="loginbg">
    </div>

    <div class="login-con">
      <Card style="border-radius: 10px"
            :bordered="false"
            dis-hover>
        <Row :gutter="48"
             class="login-con-header">
          <Col span="12"
               style="text-align: right">
          <span>乘云而上</span>
          </Col>
          <Col span="12">
          <span>逐梦云端</span>
          </Col>
        </Row>
        <Row style="margin-bottom: 24px">
          <Col span="14">
          <div class="login-con-img">
            <img :src="loginimg">
          </div>
          </Col>
          <Col span="10">
          <div class="form-con">
            <LoginForm v-if="showNumber === 1"
                       ref="loginFormRef"
                       @transmitShowforgetKey="showNumber = 2">
            </LoginForm>
            <ForgetKey class="form-con-fortget"
                       v-if="showNumber === 2"
                       @transmitHideforgetKey="showNumber = 1">
            </ForgetKey>
          </div>
          </Col>
        </Row>
      </Card>
    </div>
    <Header class="header">
      <Row class="header-row">
        <Col span="1"
             style="width: 70px">
        <img class="header-img"
             :src="logo">
        </Col>
        <Col span="10">
        <!-- <span class="header-title">云上才</span> -->
        </Col>
      </Row>
    </Header>

    <Footer class="footer">云南易用软件有限公司 ©版权所有</Footer>
  </div>
</template>

<script>
import logo from '@/assets/images/logo.png'
import loginbg from '@/assets/images/login.jpg'
import loginimg from '@/assets/images/login_img.png'
import LoginForm from './login-form'
import ForgetKey from './forget-key-form'
export default {
  name: 'Login',
  components: {
    LoginForm,
    ForgetKey
  },
  data () {
    return {
      logo,
      loginbg,
      loginimg,
      showNumber: 1
    }
  },

  methods: {

  }
}
</script>
<style lang="less" scoped>
@import "./login.less";
</style>
