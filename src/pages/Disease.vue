<template>
  <div class="case-root">
    <div class="fix">
      <el-collapse  :value="collapseActive" class="search-container">
        <el-collapse-item title="添加搜索条件" name="search" class="pd15">
          <div class="search-body">
            <el-form :inline="false" label-position="left" label-width="80px" :model="formLabelAlign">
              <el-form-item label="性别">
                <el-select v-model="filterParams.gender" placeholder="请选择">
                  <el-option
                    v-for="item in sexOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年龄范围">
                <el-select v-model="ageRange" placeholder="请选择" @change="handleAgeChange">
                  <el-option
                    v-for="item in ageOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <tag-selection title="系统分类" :options="tagOptions" v-model="filterParams.pathologyClassification" style="margin-bottom: 10px"></tag-selection>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        class="case-table"
        :header-cell-style="{
          'background-color': '#fafafa'
        }">
        <el-table-column
          label="编号"
          width="180"
          align="center">
          <template slot-scope="scope">
            <router-link :to="/diseaseDetail/+scope.row.id" style="color: #16BBB5">{{ scope.row.pathologyNo }}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="clinicalDiagnosis"
          label="部位"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="pathologyClassification"
          label="亚型"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          label="切片预览"
          min-width="250"
          align="center">
          <template slot-scope="scope">
            <swiper :options="swiperOption" class="thisSwiper" v-if="scope.row?scope.row.digitalSlides.length:false">
              <swiper-slide class="swiperTest" v-for="item in scope.row.digitalSlides" :key="item.id">
                <router-link :to="/sliceDetail/+item.id">
                  <!--<div class="swiperTest1" :style = "{backgroundImage:'url('+ item.previewImage.filepath + ')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}">-->
                  <div class="swiperTest1" :style = "{backgroundImage:'url(http://test.hengdaomed.com/wsi/v1/kfb-thumnail/'+item.id+')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}">
                  </div>
                </router-link>
              </swiper-slide>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        :current-page="pathologyCaseCondition.startPage + 1"
        layout="total, sizes, prev, pager, next, jumper"
        :total= "total"
        class="center-pagination mg-tp-30">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import tagSelection from '@/components/TagSelection'
export default {
  name: 'disease',
  components: {
    TagSelection: tagSelection
  },
  data () {
    return {
      pathologyCases: '',
      hasImage: '',
      pathologyCaseCondition: {
        'minAge': '',
        'maxAge': '',
        'clinicalDiagnosis': '',
        'pathologyClassification': '',
        'pathologyNo': '',
        'startPage': 0,
        'pageSize': 10,
        'sort': '',
        'gender': ''
      },
      filterParams: {
        'minAge': '',
        'maxAge': '',
        'gender': '',
        'pathologyClassification': ''
      },
      total: 0,
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      tagOptions: [],
      sexOptions: [{
        value: '',
        label: '不限'
      }, {
        value: 1,
        label: '男'
      }, {
        value: 2,
        label: '女'
      }],
      ageOptions: [{
        value: 'noLimit',
        label: '不限'
      },
      {
        value: 'age20',
        label: '0-20'
      }, {
        value: 'age40',
        label: '20-40'
      }, {
        value: 'age60',
        label: '40-60'
      }, {
        value: 'age80',
        label: '60-80'
      }, {
        value: 'ageOther',
        label: '80以上'
      }],
      catOptions: [
        {
          value: '1',
          label: 'test'
        }
      ],
      ageRange: '',
      collapseActive: ['search'],
      tableData: [],
      swiperOption: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  created () {
    this.loadPathologyCases()
    this.getClassification()
  },
  methods: {
    // jumpToDetail () {
    //   console.log('clicked')
    //   this.$router.push('diseaseDetail')
    // },
    onSubmit () {
      this.pathologyCaseCondition.maxAge = this.filterParams.maxAge
      this.pathologyCaseCondition.minAge = this.filterParams.minAge
      this.pathologyCaseCondition.gender = this.filterParams.gender
      this.pathologyCaseCondition.pathologyClassification = this.filterParams.pathologyClassification
      this.pathologyCaseCondition.startPage = 0
      this.loadPathologyCases()
    },
    handleAgeChange (value) {
      switch (value) {
        case 'age20':
          this.filterParams.minAge = '0'
          this.filterParams.maxAge = '20'
          break
        case 'age40':
          this.filterParams.minAge = '20'
          this.filterParams.maxAge = '40'
          break
        case 'age60':
          this.filterParams.minAge = '40'
          this.filterParams.maxAge = '60'
          break
        case 'age80':
          this.filterParams.minAge = '60'
          this.filterParams.maxAge = '80'
          break
        case 'ageOther':
          this.filterParams.minAge = '80'
          this.filterParams.maxAge = ''
          break
        default:
          this.filterParams.minAge = ''
          this.filterParams.maxAge = ''
      }
    },
    handleSizeChange (pageSize) {
      this.pathologyCaseCondition.startPage = 0
      this.pathologyCaseCondition.pageSize = pageSize
      this.loadPathologyCases()
    },
    handleCurrentChange (currentPage) {
      this.pathologyCaseCondition.startPage = currentPage - 1
      this.loadPathologyCases()
    },
    loadPathologyCases () {
      this.$api.get(this.$api.getBaseURL('v1/pathology-cases'), null, this.pathologyCaseCondition, r => {
        if (r.code === 200) {
          console.log(r.data)
          this.pathologyCases = r.data
          this.tableData = this.pathologyCases.contents
          this.total = this.pathologyCases.count
        }
      })
    },
    getClassification () {
      this.$api.get(this.$api.getBaseURL('v1/pathology-classifications'), null, null, r => {
        if (r.code === 200) {
          console.log(r.data)
          for (let i = 0; i < r.data.length; i++) {
            let option = {}
            option.selected = false
            option.value = r.data[i]
            option.label = r.data[i]
            this.tagOptions.push(option)
          }
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .fix {
    min-height: 1000px;
  }
  .search-container {
    border: 1px solid #ebeef5;
    margin-top: 30px;
  }
  .case-table {
    margin-top: 20px;
  }
  .thisSwiper {
    height: 100px;
    margin-top: 20px;
    width: 200px;
  }
  .swiperTest {
    /*background-color: red;*/
    padding: 0 40px;
    box-sizing: border-box;
  }
  .swiperTest1 {
    height: 100px;
  }
 .case-root {
   padding: 20px;
   margin-top: 20px;
   margin-bottom: 40px;
   background-color: #fff;
   border-radius: 10px;
   overflow: hidden;
 }
</style>
