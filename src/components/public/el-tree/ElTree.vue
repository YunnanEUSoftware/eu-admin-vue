<!--地址级联选择器组件-->
<template>
<div>
  <Input search placeholder="输入标签名称搜索" v-model.trim="filterText"/>
  <el-tree
        ref="tree"
      :data="treeData"
      :highlight-current="true"
      :check-on-click-node="true"
      node-key="departmentAid"
      @current-change="getCurrentNode"
      :filter-node-method="filterNode"
      :default-expanded-keys="[openKeyS]"
      :current-node-key="openKeyS"
      :expand-on-click-node="false"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="node-text">{{ data.departmentName }}</span>
        <span class="node-btn">
          <template >
            <Button size="small" type="text" @click.stop="() => append(data)">新增下级</Button>
          </template>
        </span>
      </span>
    </el-tree>
</div>
</template>
<script>
import { Tree } from 'element-ui'
export default {
  // name: 'elTree',
  components: {
    'el-tree': Tree
  },
  data () {
    return {
      filterText: ''
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
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
  methods: {
    setCurrent (val) {
      this.$refs.tree.setCurrentKey(val)
    },

    filterNode (value, data) {
      if (!value) return true
      return data.departmentName.indexOf(value) !== -1
    },
    getCurrentNode (data, node) {
      this.$emit('getSelectData', data)
    },
    append (data) {
      this.$emit('getAddData', data)
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
  @{deep} .el-tree-node__content:hover {
    .node-btn {
        display: block;
    }
  }
  .node-btn {
      display: none;
      .ivu-btn-text {
        color: #2d8cf0;
        padding:0 8px;
      }
      .ivu-btn-text:hover {
        color: #FFF;
        background: #2d8cf0;
      }
  }

</style>
