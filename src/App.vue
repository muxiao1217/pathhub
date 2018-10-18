<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  body, div{
    margin: 0;
  }
  a {
    text-decoration: none;
  }
  .head-container {
    padding: 0!important;
    /*background-color: #f2f2f2;*/
  }
  .foot-container {
    padding: 0;
    background-color: #ECEBEB;
  }
  .main {
    padding: 0;
    background-color: #f2f2f2;
    min-height: 1400px;
  }
  .main-body {
    max-width: 1400px;
    margin: 0 auto;
  }
</style>
