<template>
  <div class="login-container">
    <el-form class="login-form" ref="form" :model="user">
      <el-form-item>
        <el-input
         v-model="user.mobile"
         placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
         v-model="user.code"
         placeholder="请输入验证码"
        ></el-input>
      </el-form-item>
      <el-form-item label="记住密码">
        <el-switch v-model="user.remember"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="user.read" label="我已阅读并同意用户协议和隐私条款" name="type"></el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin" :loading="loading">立即登录</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '', // 验证码
        remember: false, // 是否记住密码
        read: true // 勾选协议
      },
      loading: false // 登录时的loading状态
    }
  },
  methods: {
    onLogin () { // 需要接口
      this.loading = true
      // 获取表单数据
      const user = this.user
      // 表单验证
      if (user.read) {
        // 发送请求
        request({
          method: 'POST',
          url: '/mp/v1_0/authorizations',
          data: user
        }).then(() => {
          // 成功提示消息
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.loading = false
        }).catch(() => {
          // 错误提示消息
          this.$message.error('登录失败,用户名或验证码错误')
          this.loading = false
        })
      } else {
        this.$message.error('请认真阅读用户协议和隐私条款')
      }
    }
  }
}
</script>

<style lang="less">
.login-container{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("./images/login_bg.jpg");
    background-size: cover;
    .login-form{
        background: rgba(255, 255, 255, .7);
        border-radius: 10px;
        box-shadow: 0px 5px 10px 3px rgb(99, 97, 97);
        padding: 50px;
        padding-bottom: 0px;
    }
}
</style>
