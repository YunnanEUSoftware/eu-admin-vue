<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="dropdownClick">
      <Badge>
        <Avatar :src="userAvator"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="personalCenter">
          <span>个人中心</span>
        </DropdownItem> -->
        <DropdownItem name="logout">
          <span style="color: #2D8cF0;">退出登录</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
export default {
  name: 'User',
  data () {
    return {}
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  mounted () {},
  methods: {
    dropdownClick (name) {
      switch (name) {
        // case 'personalCenter':
        //   this.$router.push('/personalCenter/personalCenter')
        //   break
        case 'logout':
          window.clearInterval(window.messageInterval)
          sessionStorage.clear()
          this.$router.push('/login')
          break
        default:
          break
      }
    }
  },
  computed: {
    //
  }
}
</script>
