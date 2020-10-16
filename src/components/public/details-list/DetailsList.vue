<template>
    <!-- 详情列表 -->
    <div :class="['eu-description', size, layout === 'vertical' ? 'vertical': 'horizontal']">
      <!-- 详情小标题 -->
      <div v-if="title" class="title">{{ title }}</div>
      <a-row>
        <slot></slot>
      </a-row>
    </div>
</template>

<script>

/** 自定义内容组件 */
const Item = {
  name: 'DetailsListItem',
  props: {
    label: {
      type: String,
      default: '',
      required: false
    }
  },
  render () {
    return (
      <a-col {...{ props: responsive }}>
        <div class="label">{this.$props.label}</div>
        <div class="content">{this.$slots.default}</div>
      </a-col>
    )
  }
}
// 响应式布局
const responsive = { xs: 24, sm: 24, md: 12, xxl: 8 }

export default {
  name: 'DetailsList',
  Item: Item,
  /** 接收父组件参数 */
  props: {
    // 标题
    title: {
      type: String,
      default: '',
      required: false
    },
    // 大小
    size: {
      type: String,
      required: false,
      default: 'large'
    },
    // 布局
    layout: {
      type: String,
      required: false,
      default: 'horizontal'
    }
  }
}
</script>

<style lang="less">
@import './DetailsList.less';
</style>
