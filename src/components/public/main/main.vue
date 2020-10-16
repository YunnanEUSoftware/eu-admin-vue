<template>
  <Layout style="height: 100%"
          class="main">
    <Sider hide-trigger
           collapsible
           breakpoint="xl"
           :width="265"
           :collapsed-width="64"
           v-model="collapsed"
           class="left-sider"
           :style="{overflow: 'hidden'}">
      <side-menu accordion
                 ref="sideMenu"
                 :active-name="$route.name"
                 :collapsed="collapsed"
                 @on-select="turnToPage"
                 :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div>
          <div class="logo-con-max"
               v-show="!collapsed">
             <img :src="logo" alt="">
             <span>{{title}}</span>
          </div>
          <div class="logo-con-min"
               v-show="collapsed">
          <img :src="logo" alt="">
          </div>
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed"
                    @on-coll-change="handleCollapsedChange">
          <user :user-avator="iconFileUrl" />
          <div style="padding: 0 10px;">{{name}}</div>
          <!-- <fullscreen v-model="isFullscreen"
                      style="margin-right: 10px;" /> -->
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <!-- 选项卡 用于路由管理 用户反馈不好 暂时注释 -->
          <div class="breadcrumb">
            <Breadcrumb>
              <BreadcrumbItem v-for="item in breadCrumbList" :to="item.to" :key="`bread-crumb-${item.name}`">
                {{ showTitle(item) }}
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <!-- <div class="tag-nav-wrapper">
            <tags-nav :value="$route"
                      @input="handleClick"
                      :list="tagNavList"
                      @on-close="handleCloseTag" />
          </div> -->
            <!-- <a-page-header
              style="border: 1px solid rgb(235, 237, 240);background-color: #ffffff;"
              title="Title"
            /> -->
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view v-if="refrashRouteState" />
            </keep-alive>
            <!-- <ABackTop :height="100"
                      :bottom="80"
                      :right="50"
                      container=".content-wrapper"></ABackTop> -->
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'

import { mapMutations } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual, showTitle } from '@/libs/util'
import routers from '@/router/routers'
import logo from '@/assets/images/logo.jpg'

import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    TagsNav,
    Fullscreen,
    User,
    ABackTop
  },
  data () {
    return {
      collapsed: false,
      logo,
      name: window.sessionStorage.getItem('name'),
      iconFileUrl: window.sessionStorage.getItem('iconFileUrl'),
      isFullscreen: false,
      title: this.$config.menuTitle,

      // 点击路由重新
      refrashRouteState: true,
      currentRouteName: this.$store.state.app.currentRouteName,

      // 消息列表(去重后全部)
      messageHasShow: [],
      messageListNew: []
    }
  },
  computed: {
    // 平台
    platformName () {
      return this.$store.state.user.platformName
    },
    // 公司 code
    companyCode () {
      return this.$store.state.user.companyCode
    },
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },

    cacheList () {
      return ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute'
    ]),

    showTitle (item) {
      return showTitle(item, this)
    },

    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }

      // 点击了重复的路由后刷新当前路由
      if (this.currentRouteName === name) {
        this.refrashRouteState = false
        this.$nextTick(() => { this.refrashRouteState = true })
      }
      this.currentRouteName = name

      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName)
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      // this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route' (newRoute, oldRoute) {
      const { name, query, params, meta } = newRoute
      this.currentRouteName = name
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route)

    // 如果当前打开页面不在标签栏中，跳到homeName页
    // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
    //   this.$router.push({
    //     name: this.$config.homeName
    //   })
    // }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
