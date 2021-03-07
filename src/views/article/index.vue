<template>
  <div>
    <el-card class="filter-card">
      <!-- 面包屑 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单 -->
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="(channel, index) in defaultChannels" :label="channel.name" :value="channel.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- click事件函数如果指定参数，会默认传递一个无意义参数 -->
          <el-button type="primary" :disabled="loading" @click="loadArticles(1)">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到 {{totalCount || 4}} 条数据</span>
      </div>
      <!-- 列表 -->
      <!-- 数据列表无需手动v-for，只需要修改data数据即会自动遍历 -->
      <el-table
        :data="articles.length ? articles : tableData"
        style="width: 100%"
        stripe
        size="small"
        class="list-tables"
        v-loading="loading"
      >
        <!-- prop用于设定要渲染的列表项数据字段，只能展示文本。如果需要渲染图片/按钮,可以通过官方文档的自定义表格进行设置 -->
        <el-table-column
          label="封面"
        >
          <template slot-scope="scope">
            <!-- <img v-if="!scope.row.cover" src='./images/no-cover.gif' alt="" class="article-cover">
            <img v-else :src="scope.row.cover.images[0]" alt="" class="article-cover"> -->
            <el-image
              lazy
              style="width: 100px; height: 100px"
              :src="scope.row.cover ? scope.row.cover.images[0] : './images/no-cover.gif'"
              fit="cover">
            </el-image>
          </template>
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
            <el-tag :type="articleStatus[scope.row.status].type" >{{articleStatus[scope.row.status].text}}</el-tag>
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
              @click="$router.push('/layout/publish?id=' + scope.row.id.toString())"></el-button>
            <el-button
              size="small"
              type="danger"
              circle
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount || 1"
        :current-page.sync="page"
        @current-change="onCurrentChange"
        :page-size="pageSize"
        :disabled="loading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getArticle, getArticleChannels, delArticle } from '@/api/article'
export default {
  name: 'Article',
  data () {
    return {
      form: {
        name: '',
        delivery: false,
        type: [],
        desc: ''
      },
      tableData: [{ // 文章默认数据
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        status: 2
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        status: 2
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        status: 2
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        status: 2
      }],
      articles: [], // 文章数据列表
      articleStatus: [ // 文章数据状态
        {
          text: '草稿', type: ''
        },
        {
          text: '待审核', type: 'info'
        },
        {
          text: '审核通过', type: 'success'
        },
        {
          text: '审核失败', type: 'warning'
        },
        {
          text: '已删除', type: 'danger'
        }
      ],
      channels: [], // 文章频道列表
      defaultChannels: [ // 默认文章频道列表
        { id: 0, name: 'javaScript' }, { id: 1, name: 'Vue' }, { id: 2, name: 'React' }, { id: 3, name: 'TypeScript' }
      ],
      channelId: null, // 频道id
      totalCount: 0, // 总数据条数(决定页数)
      pageSize: 20, // 每一页显示数据条数
      status: null, // 筛选数据的状态(0为草稿，1为待审核...)
      rangeDate: null, // 按时筛选的起止时间
      loading: true, // 表格数据加载状态
      page: 1 // 当前页
    }
  },
  methods: {
    // 删除文章
    handleDelete (row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.tableData = this.tableData.filter(article => article.id !== row.id)
        delArticle(`v1_0/articles/${row.id.toString()}`, 'DELETE').then(res => {
          // 删除成功更新当前页数据列表
          this.loadArticles(this.page)
        }).catch(() => {
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 加载数据
    loadArticles (page = 1) {
      // 开启loading状态
      this.loading = true
      getArticle('/v1_0/articles', {
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 停止loading状态
        this.loading = false
      }).catch(err => {
        console.log(err)
        // 停止loading状态
        this.loading = false
      })
    },

    // 加载频道列表
    loadArticlesChannels () {
      getArticleChannels('/v1_0/channels').then(res => {
        this.channels = res.data.data.channels
      }).catch(err => {
        console.log(err)
      })
    },

    // 页码变化事件函数
    // 此事件函数会通过一个page参数返回每一次点击的页码
    onCurrentChange (page) {
      this.loadArticles(page)
    }
  },
  mounted () {
    this.loadArticles()
    this.loadArticlesChannels()
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
.article-cover{
  width: 100px;
  background-size: cover;
}
</style>
