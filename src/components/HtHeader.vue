<template>
  <div>
    <el-row>
        <el-col :span="24">
          <div class="header">
            <div class="header-body">
              <div class="logo float-left">
                <img src="@/assets/pathhub.png" alt="">
                <!--<div class="logo-title"><span>衡道医疗</span></div>-->
              </div>
              <div class="float-right">
                <el-menu  class="el-menu-demo no-line" mode="horizontal" :router="router" background-color="#187fc4" text-color="#fff" active-text-color="#fff">
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
      router: true
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
