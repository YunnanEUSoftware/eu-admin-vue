<template>
  <svg class="icon" aria-hidden="true">

      <template v-if="ismodule === true">
        <use :xlink:href="`#${name}`"></use>
        <!-- 123 -->
      </template>
      <template v-else>
          <use :xlink:href="`#icon-${name}`"></use>
      </template>
  </svg>

</template>

<script>
export default {
  name: 'Icons',
  data () {
    return {
    }
  },
  props: {
    name: {},

    ismodule: {
      type: Boolean,
      default: false
    }

  },
  components: {
  }
}
</script>

<style lang="less" scoped>
  .icon {
      width: 1.8em;
      height: 1.8em;
      vertical-align: -0.5em;
  }
</style>
