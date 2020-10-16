<template>
    <div>
        <div class="drag-search">
            <label class="search-label">
                <slot name="label">搜索:</slot>
            </label>
            <Input :placeholder="placeholder" v-model.trim="searchKey" class="darg-input" @keydown.enter.native="search" @on-change="autoSearch">
            <Icon type="ios-search" slot="suffix" @click="search" />
            </Input>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SearchInput',
  data () {
    return {
      // 中间变量 避免直接修改props
      searchKey: this.keyWords
    }
  },
  props: {
    // 搜索关键字
    keyWords: {
      type: [String, Number],
      default: ''
    },
    // 搜索提示
    placeholder: {
      type: String,
      default: '请输入搜索条件'
    }
  },
  watch: {
    'keyWords': function (val) {
      if (val === '') {
        this.searchKey = val
      }
    }
  },
  computed: {
    // searchKey () {
    //   return this.keyWords
    // }
  },
  components: {
  },
  methods: {
    // 自定义事件，到父组件执行搜索请求
    search () {
      this.$emit('searchList', this.searchKey)
    },
    autoSearch () {
      if (this.searchKey === '') {
        this.search()
      }
    }
  }
}
</script>

<style lang='less'>
    .drag-search {
        .search-label {
            font-size: 14px;
            color: @gray;
            margin-right: 10px;
        }
        .darg-input {
            width: 202px;
            .ivu-input-suffix {
              cursor: pointer;
            }
        }
    }
</style>
