<template>
  <div class="slice-root">
    <div class="fix">
      <div class="slice-list">
        <div class="list-title">切片列表</div>
        <div class="list-content">
          <el-row :gutter="20">
            <el-col :xs="8" :sm="6" :md="4" :lg="4" v-for="item in digitalSlides" :key="item.id">
              <div class="slice">
                <router-link :to="'/internal/internalSliceDetail/' + item.id">
                  <el-card shadow="hover">
                    <div>
                      <div style="width: 100%; height: 200px;">
                        <img :src="'https://test.hengdaomed.com/wsi/v1/kfb-thumnail/'+item.id" alt="" style="width: 100%; height: 200px;">
                      </div>
                      <div class="slice-id">编号{{item.id}}</div>
                    </div>
                  </el-card>
                </router-link>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'annotation-detail',
  data () {
    return {
      id: this.$route.params.id,
      digitalSlides: ''
    }
  },
  created () {
    this.$api.get(this.$api.getBaseURL('v1/data-group/' + this.id), null, null, r => {
      if (r.code === 200) {
        this.digitalSlides = r.data.digitalSlideDtos.slice(1, (r.data.digitalSlideDtos.length - 1))
        // this.digitalSlides = r.data.digitalSlideDtos
        // console.log(this.digitalSlides)
      }
    })
  },
  methods: {

  }
}
</script>

<style scoped>
  .fix {
    min-height: 1000px;
  }
  .slice-list {
    margin-top: 30px;
  }
  .slice-list .list-title {
    padding: 10px;
    background-color: #fafafa;
  }
  .list-content {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .slice-id {
    text-align: center;
    margin-top: 5px;
  }
  .slice {
    margin-bottom: 10px;
  }
  .slice-root {
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 40px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
</style>
