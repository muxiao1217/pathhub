<template>
    <div class="footer">
      <el-row>
        <el-col>
          <el-col :span="24"><div class="license">COPYRIGHT &copy 2016-2018 上海衡道医学病理诊断中心 ALL RIGHTS RESERVED</div></el-col>
        </el-col>
      </el-row>
    </div>
</template>

<script>
export default {
  name: 'htFooter'
}
</script>

<style scoped>
  .footer {
    height: 100%;
    background-color: #ECEBEB;
    border-top: 1px solid #DEDDDD;
  }
  .license {
    text-align: center;
    margin-top: 20px;
    color: #909399;
  }

</style>
