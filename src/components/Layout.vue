<template>
  <div class="head-foot-wrapper">
    <el-container>
      <el-header class="head-container">
        <ht-header></ht-header>
      </el-header>
      <el-main class="main">
        <div class="main-body">
          <router-view/>
        </div>
      </el-main>
      <el-footer class="foot-container">
        <ht-footer ></ht-footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import htHeader from '@/components/HtHeader'
import htFooter from '@/components/HtFooter'
export default {
  name: 'Layout',
  components: {
    htHeader: htHeader,
    htFooter: htFooter
  }
}
</script>

<style scoped>

</style>
