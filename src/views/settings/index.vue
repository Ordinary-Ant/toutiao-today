<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="16">
          <el-form ref="form-user" :model="user" label-width="80px" :rules="formRules">
            <el-form-item label="编号">
              {{user.id || '007'}}
            </el-form-item>
            <el-form-item label="手机">
              {{user.mobile || '133333333333'}}
            </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="formloading" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" class="ele">
          <!-- <p @click="$refs.ff.click()" class="pp">
            点击修改头像
          </p> -->
          <label for="file">
            <el-avatar
              shape="square"
              :size="150"
              fit="cover"
              :src="'https://avatar.csdnimg.cn/8/A/3/3_weixin_52196306_1604397381.jpg'"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input id="file" type="file" ref="ff" @change="onFileChange" hidden>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
        title="修改头像"
        :visible.sync="dialogVisible"
        width="30%"
        append-to-body
        @opened="onDialogOped"
        @closed="onDialogcloed"
    >
      <div class="preview-image-wrap">
        <img
          :src="previewImg"
          alt=""
          class="preview-image"
          ref="preview-image"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdatePhoth" :loading="uploading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { updateUserProfile, updateUserPhoto, updateUserInfo } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'Settings',
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false, // 控制弹出框
      previewImg: '', // 图片
      cropper: null, // 裁切器
      uploading: false, // 更改头像时loading状态
      formRules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 15, message: '大小在1到15个字符之间', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱格式错误', trigger: 'blur' }
        ]
      },
      formloading: false // 更新个人资料时loading的状态
    }
  },
  methods: {
    // 编辑用户资料
    onSubmit () {
      this.formloading = true
      const { name, email, intro } = this.user
      this.$refs['form-user'].validate(valid => {
        if (!valid) {
          return
        }
        updateUserInfo('/v1_0/user/profile', 'PATCH', {
          name,
          intro,
          email
        }).then(res => {
          this.user.email = res.data.data.email
          this.user.intro = res.data.data.intro
          this.user.name = res.data.data.name
          this.$message({
            type: 'success',
            message: res.data.message
          })

          // 个人资料已修改，发布事件
          globalBus.$emit('update-user', this.user)
        })
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      })
      this.formloading = false
    },

    // 上传文件时触发
    onFileChange () {
      // 展示弹出层，预览图片
      const file = this.$refs.ff
      // 将文件对象封装为URL对象
      const blobDate = window.URL.createObjectURL(file.files[0])
      this.previewImg = blobDate
      this.dialogVisible = true
      // 防止点击同样的图片导致事件不触发
      this.$refs.ff.value = ''
    },

    // dialog完全打开时触发
    onDialogOped () {
      // 1.获取图片的DOM节点
      const image = this.$refs['preview-image']
      // 2.初始化裁切器，
      /**
       * 注意：
       *   裁切器必须基于img进行初始化且img必须是在可视情况下
       *   裁切器初始化完毕后裁切的图片发生变化后裁切器默认是不会更新的，如需要更新，有以下方式：
       *      1.裁切器.replace(url[, hasSameSize])
       *      2.销毁裁切器，重新初始化(destroy())
       **/
      if (this.cropper) {
        this.cropper.replace(this.previewImg)
        return
      }
      this.cropper = new Cropper(image, {
        // 定义裁切器的固定长宽比
        aspectRatio: 16 / 9,
        // 限制裁切器移动范围：0无限制，1不允许超出画布
        viewMode: 1,
        // 是否可以移动画布
        dragMode: 'none',
        // 画布外是否显示透明
        background: true,
        // 是否允许改变裁切器大小
        cropBoxMovable: false

        // 移动裁切器时会触发crop方法
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },

    // dialog完全关闭时触发
    onDialogcloed () {
      // 销毁裁切器
      // this.cropper.destroy()
    },

    // 更改图片
    onUpdatePhoth () {
      this.uploading = true
      // 得到裁切后的图片对象 cropperjs提供了对应的方法
      this.cropper.getCroppedCanvas().toBlob(blob => {
        const fb = new FormData()
        fb.append('photo', blob)
        // 发送请求
        updateUserPhoto('/v1_0/user/photo', 'PATCH', fb).then(res => {
          this.dialogVisible = false
          this.user.photo = window.URL.createObjectURL(blob)
          this.$message({
            type: 'success',
            message: res.data.message
          })
          // 个人资料已修改，发布事件
          globalBus.$emit('update-user', this.user)
        })
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.uploading = false
      })
    }
  },
  mounted () {
    updateUserProfile('/v1_0/user/profile').then((res) => {
      this.user = res.data.data
    })
  }
}
</script>
<style lang="less">
.ele{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pp{
  cursor: pointer;
}
.preview-image-wrap{
  .preview-image{
    display: block;
    max-width: 100%;
  }
}
</style>
