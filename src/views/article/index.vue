<template>
  <div>
    <el-card class="filter-card">
      <!-- 面包屑 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单 -->
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
            <el-radio label="已删除"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="form.region" placeholder="请选择频道">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div>
      <!-- 列表 -->
      <!-- 数据列表无需手动v-for，只需要修改data数据即会自动遍历 -->
      <el-table
        :data="articles.length ? articles : tableData"
        style="width: 100%"
        stripe
        size="small"
        class="list-tables"
      >
        <!-- prop用于设定要渲染的列表项数据字段，只能展示文本。如果需要渲染图片/按钮,可以通过官方文档的自定义表格进行设置 -->
        <el-table-column
          prop="date"
          label="封面"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="标题"
        >
        </el-table-column>
        <el-table-column
          label="状态">
          <!-- 自定义表格列(此时prop属性无效),如果想在自定义模板中使用当前遍历项数据，需要在template标签中加上 slot-scope="scope"-->
          <template slot-scope="scope">
            <el-tag  v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag type="info" v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag type="warning" v-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 4">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <!-- 自定义表格列(此时prop属性无效) -->
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button
              size="small"
              type="danger"
              circle
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getArticle } from '@/api/article'
export default {
  name: 'Article',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        status: 2
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        status: 2
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        status: 2
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        status: 2
      }],
      articles: []
    }
  },
  methods: {
    onSubmit () {
      console.log('submit')
    },
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    }
  },
  mounted () {
    getArticle('/mp/v1_0/articles').then(res => {
      this.articles = res.data.data.result
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>
<style lang="less">
.filter-card{
  margin-bottom: 20px;
}
.list-tables{
  margin-bottom: 20px;
}
</style>
