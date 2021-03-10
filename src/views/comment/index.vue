<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        class="com-table"
      >
        <el-table-column
          prop="title"
          label="标题"
          width="280">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.comment_status ? 'success' : 'danger'">{{scope.row.comment_status ? '正常' : '失败'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :type="scope.row.comment_status ? 'danger' : 'success'"
              circle
              :loading="scope.row.loading"
              :icon="scope.row.comment_status ? 'el-icon-close' : 'el-icon-check'"
              @click="handleChange(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--
        @size-change每页大小修改时触发
        @current-change页码修改时触发
        current-page当前页
        page-sizes控制可选的每页大小
        page-size当前的每页大小
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getArticle, changeCommentStatus } from '@/api/article'
export default {
  name: 'Comment',
  data () {
    return {
      tableData: [
        {
          title: '黄口小儿,你今日有血光之灾',
          total_comment_count: 9999,
          fans_comment_count: 9999,
          comment_status: false,
          id: 0,
          loading: false
        },
        {
          title: '如此看来,我儿有大帝之姿',
          total_comment_count: 9999,
          fans_comment_count: 9999,
          comment_status: true,
          id: 1,
          loading: false
        },
        {
          title: '黄口小儿,你今日有血光之灾',
          total_comment_count: 9999,
          fans_comment_count: 9999,
          comment_status: true,
          id: 2,
          loading: false
        },
        {
          title: '如此看来,我儿有大帝之姿',
          total_comment_count: 9999,
          fans_comment_count: 9999,
          comment_status: true,
          id: 3,
          loading: false
        },
        {
          title: '黄口小儿,你今日有血光之灾',
          total_comment_count: 9999,
          fans_comment_count: 9999,
          comment_status: true,
          id: 4,
          loading: false
        },
        {
          title: '如此看来,我儿有大帝之姿',
          total_comment_count: 9999,
          fans_comment_count: 9999,
          comment_status: true,
          id: 5,
          loading: false
        },
        {
          title: '黄口小儿,你今日有血光之灾',
          total_comment_count: 9999,
          fans_comment_count: 9999,
          comment_status: true,
          id: 6,
          loading: false
        },
        {
          title: '如此看来,我儿有大帝之姿',
          total_comment_count: 9999,
          fans_comment_count: 9999,
          comment_status: true,
          id: 7,
          loading: false
        }
      ],
      comments: [],
      currentPage: 1,
      totalCount: 8, // 所有数据条数
      pageSize: 10
    }
  },
  methods: {
    // 修改状态
    handleChange (row) {
      row.comment_status = !row.comment_status
      row.loading = true
      changeCommentStatus('/v1_0/comments/status', 'PUT', row.id, row.comment_status).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
      this.$message({
        message: row.comment_status ? '开启成功' : '关闭成功',
        type: 'success'
      })
      row.loading = false
    },

    // 修改每页大小
    handleSizeChange () {
      this.loadComment(1)
    },

    // 跳页
    handleCurrentChange (page) {
      this.loadComment(page)
    },

    // 加载评论
    loadComment (page = 1) {
      this.currentPage = page
      getArticle('/v1_0/articles', {
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(comment => {
          comment.loading = false
        })
        this.totalCount = results.total_count
        this.comments = results
      })
    }
  },
  mounted () {
    this.loadComment()
  }
}
</script>
<style lang="less">
.com-table{
  margin-bottom: 20px;
}
</style>
