<template>
  <div class="annotation-root">
    <div class="fix">
      <el-collapse  :value="collapseActive" class="search-container">
        <el-collapse-item title="添加搜索条件" name="search" class="pd15">
          <div class="search-body">
            <el-row>
              <el-col :span="6">
                <el-form :inline="false" label-position="left" label-width="100px" :model="formLabelAlign">
                  <el-form-item label="数据集名称">
                    <el-input v-model="filterParams.name"></el-input>
                  </el-form-item>
                  <el-form-item label="关键字">
                    <el-input v-model="filterParams.keys"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">搜索</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
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
        }"
        @row-click="jumpToDetail">
        <el-table-column
          prop="id"
          label="编号"
          min-width="180"
          align="center">
        </el-table-column>
        <el-table-column
          label="数据集名称"
          min-width="180"
          align="center">
          <template slot-scope="scope">
            <router-link :to="/AnnotationDetail/+scope.row.id" style="color: #16BBB5">{{ scope.row.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="age"
          label="所属分类"
          min-width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="position"
          label="部位"
          min-width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="cate"
          label="数量"
          min-width="180"
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        :current-page="annotationCondition.startPage + 1"
        layout="total, sizes, prev, pager, next, jumper"
        :total= "total"
        class="center-pagination mg-tp-30">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'annotation',
  data () {
    return {
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      collapseActive: ['search'],
      dataGroupCondition: {},
      tableData: [],
      total: '',
      annotationCondition: {
        'startPage': 0,
        'pageSize': 10,
        'name': '',
        'keys': ''
      },
      filterParams: {
        'name': '',
        'keys': ''
      }
    }
  },
  created () {
    this.loadDataGroup()
  },
  methods: {
    loadDataGroup () {
      this.$api.get(this.$api.getBaseURL('v1/data-groups'), null, this.dataGroupCondition, r => {
        if (r.code === 200) {
          console.log(r.data, 'datagroup')
          this.tableData = r.data.contents
        }
      })
    },
    onSubmit () {
      this.dataGroupCondition.name = this.filterParams.name
      this.dataGroupCondition.keys = this.filterParams.keys
      this.dataGroupCondition.startPage = 0
      this.loadDataGroup()
    },
    handleSizeChange (pageSize) {
      this.dataGroupCondition.startPage = 0
      this.dataGroupCondition.pageSize = pageSize
      this.loadDataGroup()
    },
    handleCurrentChange (currentPage) {
      this.dataGroupCondition.startPage = currentPage - 1
      this.loadDataGroup()
    }
  }
}
</script>

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
  .annotation-root {
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 40px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
</style>
