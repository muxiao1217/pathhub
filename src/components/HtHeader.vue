<template>
  <div>
    <el-row>
        <el-col :span="24">
          <div class="header">
            <div class="header-body">
              <router-link to="/">
                <div class="logo float-left" @click="activateIndex">
                  <img src="@/assets/pathhub.png" alt="">
                </div>
              </router-link>
              <div class="float-right">
                <el-menu  class="el-menu-demo no-line" mode="horizontal" :router="router" background-color="#187fc4" text-color="#fff" active-text-color="#fff" :default-active="activeTab">
                  <el-menu-item index="/" class="no-line">病例</el-menu-item>
                  <el-menu-item index="/slice" class="no-line">切片</el-menu-item>
                  <el-menu-item index="/annotation" class="no-line">标注</el-menu-item>
                </el-menu>
              </div>
            </div>
          </div>
        </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'htHeader',
  data () {
    return {
      router: true,
      activeTab: ''
    }
  },
  created () {
    let route = this.$route.path.split('/')
    if (route[1] === '' || route[1] === 'diseaseDetail') {
      this.activeTab = '/'
    } else if (route[1] === 'slice' || route[1] === 'sliceDetail') {
      this.activeTab = '/slice'
    } else if (route[1] === 'annotation' || route[1] === 'annotationDetail') {
      this.activeTab = '/annotation'
    }
  },
  watch: {
    '$route' () {
      let route = this.$route.path.split('/')
      if (route[1] === '' || route[1] === 'diseaseDetail') {
        this.activeTab = '/'
      } else if (route[1] === 'slice' || route[1] === 'sliceDetail') {
        this.activeTab = '/slice'
      } else if (route[1] === 'annotation' || route[1] === 'annotationDetail') {
        this.activeTab = '/annotation'
      }
    }
  },
  methods: {
    activateIndex () {
      // this.$router.history.go()
      // console.log('/' + this.$route.path.split('/')[1])
    }
  }
}
</script>

<style scoped>
  .header {
    height: 60px;
    /*background-color: red;*/
    border-bottom: 1px solid #f2f2f2;
    background-color: #187fc4;
  }
  .header-body {
    height: 100%;
    max-width: 1408px;
    margin: 0 auto;
    /*background-color: #f2f2f2;*/
  }
  .logo img {
    margin-left: 20px;
    margin-top: 10px;
    width: 200px;
    display:block;
    float:left;
  }
  .logo-title {
    float: left;
    font-size: 20px;
    margin-top: 17px;
    margin-left: 5px;
  }
  .header .el-menu-item {
    font-size: 16px;
  }

</style>
