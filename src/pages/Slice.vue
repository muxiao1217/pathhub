<template>
  <div class="slice-root">
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
              <tag-selection title="切片分类" :options="tagOptions" v-model="filterParams.digitalSlideType" style="margin-bottom: 10px"></tag-selection>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="slice-list">
        <div class="list-title">切片列表</div>
        <div class="list-content">
          <el-row :gutter="20">
            <el-col :xs="8" :sm="6" :md="4" :lg="4" v-for="item in digitalSlides.contents" :key="item.id">
              <div class="slice">
                <router-link :to="/sliceDetail/ + item.id">
                  <el-card shadow="hover">
                    <div>
                      <div style="width: 100%; height: 200px;">
                        <!--<img :src="item.previewImage.filepath" alt="" style="width: 100%; height: 200px;">-->
                        <img :src="'http://test.hengdaomed.com/wsi/v1/kfb-thumnail/'+item.id" style="width: 100%; height: 200px;">
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
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[12, 24, 36, 48]"
        :page-size="12"
        :current-page="digitalSlideCondition.startPage + 1"
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
  name: 'slice',
  components: {
    TagSelection: tagSelection
  },
  data () {
    return {
      digitalSlides: '',
      digitalSlideCondition: {
        'minAge': '',
        'maxAge': '',
        'pathologyCaseId': '',
        'keyWords': '',
        'originPathologyNo': '',
        'startPage': 0,
        'pageSize': 12,
        'sort': '',
        'gender': '',
        'tags': '',
        'digitalSlideType': ''
      },
      filterParams: {
        'minAge': '',
        'maxAge': '',
        'gender': '',
        'digitalSlideType': ''
      },
      total: 0,
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      tagOptions: [{
        selected: false,
        value: 'BIOPSY',
        label: '活体组织切片'
      }, {
        selected: false,
        value: 'IHC_MARKER',
        label: '免疫组化切片'
      }, {
        selected: false,
        value: 'TMA',
        label: '芯片'
      }, {
        selected: false,
        value: 'OTHER',
        label: '其他'
      }],
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
      ageRange: '',
      catOptions: [
        {
          value: '1',
          label: 'test'
        }
      ],
      collapseActive: ['search']
    }
  },
  created () {
    this.getSlides()
  },
  methods: {
    getSlides () {
      this.$api.get(this.$api.getBaseURL('v1/digitalslides'), null, this.digitalSlideCondition, r => {
        if (r.code === 200) {
          this.digitalSlides = r.data
          this.tableData = this.digitalSlides.contents
          this.total = this.digitalSlides.count
        }
      })
    },
    handleSizeChange (pageSize) {
      this.digitalSlideCondition.startPage = 0
      this.digitalSlideCondition.pageSize = pageSize
      this.getSlides()
    },
    handleCurrentChange (currentPage) {
      this.digitalSlideCondition.startPage = currentPage - 1
      this.getSlides()
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
    onSubmit () {
      this.digitalSlideCondition.maxAge = this.filterParams.maxAge
      this.digitalSlideCondition.minAge = this.filterParams.minAge
      this.digitalSlideCondition.gender = this.filterParams.gender
      this.digitalSlideCondition.digitalSlideType = this.filterParams.digitalSlideType
      this.digitalSlideCondition.startPage = 0
      this.getSlides()
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
