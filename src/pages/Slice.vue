<template>
  <div class="slice-root">
    <div class="fix">
      <el-collapse  :value="collapseActive" class="search-container">
        <el-collapse-item title="添加搜索条件" name="search" class="pd15">
          <div class="search-body">
            <tag-selection title="系统分类" :options="sysOptions" v-model="filterParams.sysType"></tag-selection>
            <tag-selection title="切片分类" :options="sliceOptions" v-model="filterParams.digitalSlideType"></tag-selection>
            <tag-selection title="染色类型" :options="dyingOptions" v-model="filterParams.dyingType"></tag-selection>
            <tag-selection title="部位分类" :options="organOptions" v-model="filterParams.position"></tag-selection>
            <el-form :inline="true" label-position="left" :model="formLabelAlign" class="mg-tp-20">
              <el-form-item label="性别:">
                <el-checkbox-group v-model="genderList" @change="handleSexChange" class="sex-checkbox">
                  <el-checkbox label="1">男</el-checkbox>
                  <el-checkbox label="2">女</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="年龄范围:" class="mg-left-20">
                <el-select v-model="ageRange" placeholder="请选择" @change="handleAgeChange">
                  <el-option
                    v-for="item in ageOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="mg-left-20">
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
        'sysType': '',
        'startPage': 0,
        'pageSize': 12,
        'sort': '',
        'gender': '',
        'tags': '',
        'digitalSlideType': '',
        'dyingType': '',
        'position': ''
      },
      filterParams: {
        'minAge': '',
        'maxAge': '',
        'gender': '',
        'digitalSlideType': '',
        'pathologyClassification': '',
        'dyingType': '',
        'position': ''
      },
      total: 0,
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      sliceOptions: [{
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
      dyingOptions: [
        {
          selected: false,
          value: 'HE',
          label: 'HE'
        }, {
          selected: false,
          value: 'IHC',
          label: 'IHC'
        }, {
          selected: false,
          value: 'SPECIAL_DYING',
          label: '特殊染色'
        }
      ],
      organOptions: [
        // {
        //   selected: false,
        //   value: '宫颈',
        //   label: '宫颈'
        // },
        {
          selected: false,
          value: '子宫',
          label: '子宫'
        }, {
          selected: false,
          value: '卵巢',
          label: '卵巢'
        },
        // {
        //   selected: false,
        //   value: '胎盘',
        //   label: '胎盘'
        // },
        // {
        //   selected: false,
        //   value: '宫颈细胞学',
        //   label: '宫颈细胞学'
        // },
        {
          selected: false,
          value: '乳腺',
          label: '乳腺'
        },
        {
          selected: false,
          value: '皮肤',
          label: '皮肤'
        },
        {
          selected: false,
          value: '食管',
          label: '食管'
        },
        {
          selected: false,
          value: '肝脏',
          label: '肝脏'
        },
        // {
        //   selected: false,
        //   value: ' 耳',
        //   label: ' 耳'
        // },
        // {
        //   selected: false,
        //   value: ' 涎腺',
        //   label: ' 涎腺'
        // },
        {
          selected: false,
          value: ' 颈部',
          label: ' 颈部'
        },
        // {
        //   selected: false,
        //   value: '软组织',
        //   label: '软组织'
        // },
        {
          selected: false,
          value: '盆腔',
          label: '盆腔'
        }, {
          selected: false,
          value: '肺',
          label: '肺'
        }
      ],
      sysOptions: [
        {
          selected: false,
          value: '女性生殖系统',
          label: '女性生殖系统'
        }, {
          selected: false,
          value: '消化系统',
          label: '消化系统'
        }, {
          selected: false,
          value: '头颈部',
          label: '头颈部'
        }, {
          selected: false,
          value: '乳腺',
          label: '乳腺'
        }, {
          selected: false,
          value: '皮肤',
          label: '皮肤'
        }, {
          selected: false,
          value: '软组织',
          label: '软组织'
        }, {
          selected: false,
          value: '男性生殖系统',
          label: '男性生殖系统'
        }, {
          selected: false,
          value: '泌尿系统',
          label: '泌尿系统'
        }, {
          selected: false,
          value: '内分泌系统',
          label: '内分泌系统'
        }, {
          selected: false,
          value: ' 腹腔盆腔与腹膜后 ',
          label: ' 腹腔盆腔与腹膜后 '
        }, {
          selected: false,
          value: '胸部',
          label: '胸部'
        }, {
          selected: false,
          value: '淋巴造血系统',
          label: '淋巴造血系统'
        }, {
          selected: false,
          value: '细胞学',
          label: '细胞学'
        }
      ],
      genderList: [],
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
    handleSexChange (value) {
      if (value.length === 0 || value.length === 2) {
        this.filterParams.gender = ''
      } else {
        this.filterParams.gender = value[0]
      }
    },
    onSubmit () {
      this.digitalSlideCondition.maxAge = this.filterParams.maxAge
      this.digitalSlideCondition.minAge = this.filterParams.minAge
      this.digitalSlideCondition.gender = this.filterParams.gender
      this.digitalSlideCondition.digitalSlideType = this.filterParams.digitalSlideType
      this.digitalSlideCondition.dyingType = this.filterParams.dyingType
      this.digitalSlideCondition.sysType = this.filterParams.sysType
      this.digitalSlideCondition.position = this.filterParams.position
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
