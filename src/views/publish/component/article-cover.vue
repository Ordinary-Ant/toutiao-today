<template>
  <div @click="clickUploadCover" class="cover-container">
    <div class="img-wrap">
      <img class="cover-img" ref="cover-img" :src="value">
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="handleClose">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <!--
            ref的作用：
              1.作用到普通标签可以获取其DOM
              2.作用到组件上可以获得组件实例
           -->
          <image-list
            :is-show="false"
            ref="image-list"
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :limit="1"
            :http-request="onUploadCover"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCover">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { uploadImage } from '@/api/images'
import ImageList from '@/views/image/component/image-list.vue'
export default {
  name: 'ArticleCover',
  props: {
    value: String
  },
  data () {
    return {
      dialogVisible: false,
      activeName: 'first',
      coverFile: null
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },

    // dialog状态
    clickUploadCover () {
      this.dialogVisible = true
    },

    // 用于覆盖默认的上传文件操作，功能是取得文件对象
    onUploadCover (file) {
      this.coverFile = file.file
    },

    // 上传文件
    onCover () {
      if (this.activeName === 'first') {
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected !== null) {
          // 关闭对话框
          this.dialogVisible = false
          // 将图片url传递给父组件(不需要上传文件,因为这些图片已经是服务端传过来的)
          this.$emit('input', imageList.images[selected].url)
        }
      } else if (this.activeName === 'second') {
        if (this.coverFile) {
          const fb = new FormData()
          fb.append('image', this.coverFile)
          uploadImage('/v1_0/user/images', 'POST', fb).then(res => {
            // 关闭dialog
            this.dialogVisible = false
            // 得到服务端响应的url,展示预览
            // this.$refs['cover-img'].src = window.URL.createObjectURL(this.coverFile)

            // 要将服务器响应的url存放到父组件中封面数组中进行整体文章的提交
            // this.$emit('update-cover', res.data.data.url)
            this.$emit('input', res.data.data.url)
          })
          // 关闭dialog
          this.dialogVisible = false
          // 得到服务端响应的url,展示预览
          // this.$refs['cover-img'].src = window.URL.createObjectURL(this.coverFile)
          // 要将服务器响应的url存放到父组件中封面数组中进行整体文章的提交
          // this.$emit('update-cover', window.URL.createObjectURL(this.coverFile))
          this.$emit('input', window.URL.createObjectURL(this.coverFile))
        }
      }
    }
  },
  components: {
    ImageList
  }
}
</script>
<style lang="less">
.img-wrap{
  width: 100px;
  height: 100px;
  border: solid 1px #ccc;
}
.cover-container{
  width: 340px;
}
.cover-img{
  width: 100%;
}
</style>
