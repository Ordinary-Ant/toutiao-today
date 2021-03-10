<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-head">
        <el-radio-group v-model="collect" size="small" class="radios" @change="loadImages(1)">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button class="addI" type="success" size="small" @click="dialogUploadVisible = true">添加图片</el-button>
      </div>
      <el-row :gutter="20">
        <el-col :lg="4" :md="6" :sm="8" :xs="12" :span="24" v-for="index in 24" :key="index" class="imgcol">
            <el-image
              style="height: 130px"
              :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'"
              fit="cover">
            </el-image>
            <div class="imgbtn">
              <el-button
                type="warning"
                :icon="index.is_collect ? 'el-icon-star-on' : 'el-icon-star-off'"
                circle
                size="mini"
                :loading="index.loading"
                @click="onCollectImg(index)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="onDeleImg(index)"
                :loading="index.loading"
              ></el-button>
            </div>
        </el-col>
      </el-row>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size.sync="pageSize"
        @current-change="onPageChange"
        :current-page.sync="page"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="上传图片" :visible.sync="dialogUploadVisible" :append-to-body="true">
      <!--
        el-upload组件本身支持请求提交上传操作，会自动发请求
          请求方式：默认为POST
          请求路径：action
          请求头：headers
       -->
      <el-upload
        :show-file-list="false"
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadToken"
        name="image"
        :on-success="onUploadSuccess"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import { getImages, collectImages, delImages } from '@/api/images'
export default {
  name: 'Images',
  data () {
    return {
      collect: false, // 默认选中全部
      images: [], // 全部图片
      dialogUploadVisible: false, // 提示框
      // uploadToken: {
      //   Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('user')).token}`
      // }
      pageSize: 20,
      totalCount: 24,
      page: 1
    }
  },
  methods: {
    // 加载所有图片
    loadImages (page = 1) {
      // 重置高亮页面，防止数据与页面不对应
      this.page = page
      getImages('/v1_0/user/images', {
        collect: this.collect, // 切换全部为收藏
        page, // 页数
        per_page: this.pageSize // 每页元素个数
      }).then(res => {
        const results = res.data.data.results
        // 为每个img对象添加一个loading属性用于控制每一个按钮loading状态
        results.forEach(img => {
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },

    // 上传成功事件函数
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(1)
    },

    // 跳页
    onPageChange (page) {
      this.loadImages(page)
    },

    // 加入或取消收藏
    onCollectImg (img) {
      // 展示loading
      img.loading = true
      // 如果已加入收藏，取消收藏，反之加入
      collectImages(`/v1_0/user/images/${img.id}`, 'PUT', !img.is_collect).then(res => {
        img.is_collect = !img.is_collect
        this.$message({
          message: res.data.message,
          type: 'success'
        })
        // 关闭loading
        img.loading = false
      })
    },

    // 删除图片
    onDeleImg (img) {
      // 展示loading
      img.loading = true
      delImages(`/v1_0/user/images/${img.id}`, 'DELETE').then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.loadImages(this.page)
        // 关闭loading
        img.loading = false
      })
    }
  },
  mounted () {
    this.loadImages(1)
  }
}
</script>
<style lang="less">
.text {
    font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.box-card {
  width: 480px;
}
.radios{
  margin-bottom: 20px;
}
.action-head{
  display: flex;
  justify-content: space-between;
}
.addI{
  height: 32px;
}
.imgcol{
  position: relative;
}
.imgbtn{
  height: 30px;
  position: absolute;
  background: rgba(0,0,0,0.5);
  z-index: 9999;
  bottom: 5px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.imgbtn i {
  font-size: 20px;
  color: #fff;
}
</style>
