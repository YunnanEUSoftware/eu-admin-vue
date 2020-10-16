<!--地址级联选择器组件-->
<template>
  <Cascader v-model="selectList"
            :data="regionList"
            @on-change="changeRegion"
            :load-data="clickCascaderGetList"

            transfer></Cascader>
</template>
<script>
import { listConvertTree } from '@/libs/util.js'
import {
  getRegionList
} from '@/api/department-manage'
export default {
  name: 'areaCascader',
  data () {
    return {
      theLevelNum: 0,
      selectList: this.defaultSelected
    }
  },
  props: {
    // 接收父级组件传入的数据源，因为数据源需要做处理，所以父级组件需要使用 v-model 来传入数据，子组件使用 value 值进行接收（value不可修改）
    regionList: {
      type: Array,
      // 对象/数组的默认值需要使用工厂函数返回
      default: () => []
    },

    // 默认选中地址
    defaultSelected: {
      type: Array,
      default: () => []
    }

  },
  mounted () {
  },
  methods: {
    // 点击地址获取子列表
    async clickCascaderGetList (item, callback) {
      item.loading = true

      // 地址级别 如果 theLevelNum 为 0 省级，为 1 市级，为 2 县/区级
      if (this.regionList.indexOf(item) !== -1) {
        this.theLevelNum = 1
      } else {
        this.theLevelNum = 2
      }

      // 请求参数
      let paramsData = {
        regionAid: item.value
      }

      const { success, data } = await getRegionList(paramsData)
      if (success) {
        item.children = listConvertTree(this.theLevelNum, data)
        item.loading = false
        callback()
      }
    },

    // 改变地址选择时，将选择的地址数据回传出去
    changeRegion (value, selectedData) {
      this.$emit('getSelectData', value, selectedData)
    }
  }
}
</script>

<style scoped>
</style>
