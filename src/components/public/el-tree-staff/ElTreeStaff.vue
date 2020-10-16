<!--地址级联选择器组件-->
<template>
<div>
  <Input search placeholder="输入部门/分公司名称搜索" v-model="filterText"/>
   <vuescroll :ops="ops">
    <el-tree
        :style="styleObject"
        ref="tree"
      :data="treeData"
      :highlight-current="true"
      :check-on-click-node="true"
      node-key="departmentAid"
      :default-expanded-keys="[openKeyS]"
      @current-change="getCurrentNode"
      :filter-node-method="filterNode"
      :current-node-key="openKeyS"
      :expand-on-click-node="false"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="node-text">{{ data.departmentName }}</span>
      </span>
    </el-tree>
       </vuescroll>
</div>
</template>
<script>
import { Tree } from 'element-ui'
import vuescroll from 'vuescroll/dist/vuescroll-native'
export default {
  name: 'elTreeStaff',
  data () {
    return {
      filterText: '',
      // 滚动条样式
      ops: {
        vuescroll: {},
        scrollPanel: {
          scrollingX: false
        },
        rail: {
          background: '#a5d6a7',
          opacity: 0,
          size: '10px',
          specifyBorderRadius: false,
          gutterOfEnds: null, // 轨道距 x 和 y 轴两端的距离
          gutterOfSide: '0', // 距离容器的距离
          keepShow: false, // 是否即使 bar 不存在的情况下也保持显示
          border: 'none' // 边框
        },
        bar: {
          hoverStyle: true,
          onlyShowBarOnScroll: false, // 是否只有滚动的时候才显示滚动条
          background: '#808695', // 颜色
          // opacity: 0.5,
          size: '8px'
        }
      },
      styleObject: {
        maxHeight: ''
      }

    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }

  },
  components: {
    vuescroll: vuescroll,
    'el-tree': Tree
  },
  props: {
    // 接收父级组件传入的数据源
    treeData: {
      type: Array,
      default: () => []
    },
    // 展开选中的项
    openKeyS: {
      type: Number,
      // 对象/数组的默认值需要使用工厂函数返回
      default: null
    }

  },
  mounted () {
    this.treeHeight()
  },
  methods: {

    treeHeight () {
      const winHeight = document.body.scrollHeight
      let optionHeight = NaN
      optionHeight = winHeight - 380
      this.styleObject.maxHeight = optionHeight + 'px'
    },

    setCurrent (val) {
      this.$refs.tree.setCurrentKey(val)
    },

    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getCurrentNode (data, node) {
      this.$emit('getSelectData', data)
    }

  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
 .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  @{deep} .el-tree-node__content {

    height: 40px;
  }
   @{deep}.el-tree {
      border-right: 1px solid #dcdee2;
      margin-top: 16px
  }
  @{deep}.el-tree-node {
    padding: 4px 0 8px 0
  }
  @{deep}.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    color: #2d8cf0;
    background: #f0faff;
    position: relative;
    &::after {
    content: "";
      position: absolute;
      top: 0;
      right: -1px;
      bottom: 0;
      border-right: 3px solid #1890ff;
    }
  }
  @{deep}.el-icon-caret-right {
    color:#606266
  }
  @{deep}.el-tree-node__expand-icon.is-leaf {
    color:transparent
  }
  .node-text {

    white-space: normal;
  }

</style>
