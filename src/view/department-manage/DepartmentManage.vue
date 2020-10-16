<template>
  <div>
    <department-manage></department-manage>
  </div>
</template>

<script>
import DepartmentManage from '_cb/department-manage/DepartmentManage'
export default {
  name: 'DepartmentManage',
  components: {
    'department-manage': DepartmentManage
  }
}
</script>

<style lang="less" scoped>

</style>
