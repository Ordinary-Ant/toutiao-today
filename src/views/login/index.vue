<template>
  <div class="login-container">
    <!--
      配置Form表单验证
        1.给el-form绑定表单数据对象 :model="user"
        2.给需要表单验证的控件绑定prop属性 prop="code"
        3.给el-form绑定:rules属性来配置验证规则 :rules="formRules"

      在点击登录后强制触发表单验证
        1.为el-form绑定ref属性 ref="form"
        2.通过this.$refs.form获取el-form对象,并调用validate()方法
     -->
    <el-form class="login-form" ref="login-form" :model="user" :rules="formRules">
      <el-form-item prop="mobile">
        <el-input
         v-model="user.mobile"
         placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
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
import { login } from '@/api/user'
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
      loading: false, // 登录时的loading状态
      formRules: { // 表单验证规则
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3|7|8|6]\d{9}$/, message: '请输入正确手机号格式', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录事件函数
    onLogin () { // 需要接口
      // 获取表单数据
      // const user = this.user

      // 表单验证
      // 异步validate()需要传入一个回调,该回调函数会在校验结束后被调用,并传入两个参数(valid和err)：valid为验证是否成功,err为失败控件的配置消息
      this.$refs['login-form'].validate(valid => {
        if (!valid) {
          return
        }

        // 验证通过，发送请求
        this._login()
      })
    },

    // 封装的登录请求
    _login () {
      this.loading = true
      if (this.user.read) {
        login('/v1_0/authorizations', this.user, 'POST').then(res => {
          // 成功提示消息
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.loading = false
          // 将接口返回的关于用户的相关数据(主要是token)存放到本地存储
          window.localStorage.setItem('user', JSON.stringify(res.data.data))

          // 跳转到首页
          this.$router.push({ name: 'Home' })
        }).catch(() => {
          // 错误提示消息
          this.$message.error('登录失败,用户名或验证码错误')
          this.loading = false
          // 跳转到首页(无接口情况下测试用)
          this.$router.push({ name: 'Home' })
        })
      } else {
        this.$message.error('请同意用户协议和隐私条款')
        this.loading = false
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
