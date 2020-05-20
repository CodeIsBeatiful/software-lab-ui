<template>
  <div class="dashboard-container">
    <el-tag>标签一</el-tag>
    <el-tag type="success">标签二</el-tag>
    <div class="dashboard-text">name: {{ name }}，hello!</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
