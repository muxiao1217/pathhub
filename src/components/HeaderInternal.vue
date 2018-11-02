<template>
  <div>
    <el-row>
        <el-col :span="24">
          <div class="header">
            <div class="header-body">
              <router-link to="/internal">
                <div class="logo float-left">
                  <img src="@/assets/pathhub.png" alt="">
                </div>
              </router-link>
              <div v-if="logged" class="float-right logged">
                用户: {{userName}}
                <div class="logout" @click="handleLogout">
                  登出
                </div>
              </div>
              <div v-if="!logged" class="float-right login">
                登录
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

    }
  },
  computed: {
    userName () {
      return this.$store.state.userName
    },
    logged () {
      return this.$store.state.logged
    }
  },
  created () {
  },
  watch: {

  },
  methods: {
    handleLogout () {
      this.$store.commit('LOGOUT')
      this.$router.push({ path: '/internal/login' })
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
  .logged {
    padding: 18px;
    color: #ffffff;
  }
  .logout {
    padding-left: 20px;
    display: inline-block;
    cursor: pointer;
  }
  .login {
    padding: 18px;
    color: #ffffff;
    cursor: pointer;
  }

</style>
