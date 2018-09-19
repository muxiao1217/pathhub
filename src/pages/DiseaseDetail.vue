<template>
  <div class="case-root">
    <div class="fix">
      <div class="intro">
        <div class="intro-title">患者信息</div>
        <div class="intro-content">
          <el-row>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <div class="info">
                  <span class="info-title">性别：</span>
                  <span class="info-content">{{data.sex}}</span>
                </div>
                <div class="info">
                  <span class="info-title">年龄：</span>
                  <span class="info-content">{{data.age}}</span>
                </div>
                <div class="info pd-bt-10">
                  <span class="info-title">地区：</span>
                  <span class="info-content">{{data.province}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="8"><div class="grid-content bg-purple">
              <div class="grid-content bg-purple">
                <div class="info">
                  <span class="info-title">病理号：</span>
                  <span class="info-content">{{data.pathologyNo}}</span>
                </div>
                <div class="info">
                  <span class="info-title">病区：</span>
                  <span class="info-content">{{data.department}}</span>
                </div>
                <div class="info pd-bt-10">
                  <span class="info-title">临床诊断：</span>
                  <span class="info-content">{{data.clinicalDiagnosis}}</span>
                </div>
              </div>
            </div>
            </el-col>
            <el-col :span="8"><div class="grid-content bg-purple">
              <div class="grid-content bg-purple">
                <div class="info">
                  <span class="info-title">病理分类：</span>
                  <span class="info-content">{{data.pathologyClassification}}</span>
                </div>
                <div class="info">
                  <span class="info-title">标本名称：</span>
                  <span class="info-content">{{data.sampleName}}</span>
                </div>
              </div>
            </div></el-col>
          </el-row>
          <div class="split-line"></div>
          <el-row class="detail-info">
            <el-col :span="24">
              <div class="grid-content bg-purple">
                <div class="info">
                  <span class="info-title">诊断详情：</span>
                  <span class="info-content">{{data.pathologyDiagnosis}}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="slice-list">
        <div class="list-title">切片列表</div>
        <div class="list-content">
          <div class="align-center" v-if="!data.digitalSlides.length > 0">暂无内容</div>
          <swiper :options="swiperOption">
            <swiper-slide v-for="item in data.digitalSlides" :key="item.id">
              <div class="slice">
                <router-link :to="/sliceDetail/+item.id">
                  <el-card shadow="hover">
                    <div>
                      <div :style = "{backgroundImage:'url(https://test.hengdaomed.com/wsi/v1/kfb-thumnail/'+item.id+')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: '100%', height: '200px'}"></div>
                      <div class="slice-id">编号{{item.id}}</div>
                    </div>
                  </el-card>
                </router-link>
              </div>
            </swiper-slide>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </swiper>
        </div>
      </div>
      <div class="disease-list">
        <div class="list-title">相关病例</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'xxx',
  data () {
    return {
      id: this.$route.params.id,
      data: {},
      swiperOption: {
        slidesPerView: 6,
        spaceBetween: 30,
        slidesPerGroup: 1,
        // loop: true,
        // loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  created () {
    this.$api.get(this.$api.getBaseURL('v1/pathology-case/' + this.id), null, null, r => {
      if (r.code === 200) {
        this.data = r.data
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .fix {
    min-height: 1000px;
  }
  .case-root {
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 40px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
  .intro {
    border: 1px solid #ebeef5;
    overflow: hidden;
  }
  .intro-title {
    background-color: #fafafa;
    padding: 10px;
    color: #2c3e50;
  }
  .info {
    padding-left: 10px;
    padding-top: 10px;
    font-size: 14px;
  }
  .info-content {
    color: #909399;
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
  .disease-list {
    margin-top: 30px;
    padding: 10px;
    background-color: #fafafa;
  }
  .split-line {
    height: 1px;
    margin-left: 10px;
    margin-right: 10px;
    border-bottom: 1px solid #ebeef5;
  }
  .detail-info {
    margin-bottom: 20px;
  }
  .no-content {
  }
</style>
