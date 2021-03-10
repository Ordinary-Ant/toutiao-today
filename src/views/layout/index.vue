<template>
  <el-container class="layout-container">
    <el-aside class="aside" :width="isCollapse ? 'auto' : '200px'">
      <AsideApp class="aside-menu" :isCollapse="isCollapse"/>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="isCollapse = !isCollapse"></i>
          <span>昊天天都里大宇</span>
        </div>
        <el-dropdown>
          <div class="el-dropdown-link">
            <img :src="user.photo || 'https://avatar.csdnimg.cn/8/A/3/3_weixin_52196306_1604397381.jpg'" alt="" class="header-img">
            <strong>{{ user.name || '天' }}</strong>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人设置</el-dropdown-item>
            <!-- elementui规定在这个组件中默认是不能绑定click事件的，vue可以通过给事件绑定native修饰符将click事件绑定给组件 -->
            <el-dropdown-item @click.native="onLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import AsideApp from './components/aside'
import { updateUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'layput',
  data () {
    return {
      user: {}, // 接口得到的个人信息
      isCollapse: false // 侧边栏的展示状态
    }
  },
  mounted () {
    // 组件一旦初始化，加载个人信息
    // 除了登录接口，其余接口都需要有身份，即存在token才能访问
    updateUserProfile('/v1_0/user/profile').then((res) => {
      this.user = res.data.data
    })

    // 注册修改个人信息事件
    globalBus.$on('update-user', (user) => {
      // this.user = user 注意：不可直接将对象引用传递
      this.user.name = user.name
      this.user.photo = user.photo
    })
  },
  methods: {
    // 退出账号
    onLogout () {
      this.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        // 清除登录状态
        window.localStorage.removeItem('user')
        // 跳转到登录页
        this.$router.push({ name: 'Login' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  },
  components: {
    AsideApp
  }
}
</script>
<style lang="less">
.layout-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.aside {
  width: 200px;
  background-color: #ccc;
  .aside-menu {
    height: 100%;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .header-img{
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.main {
  background-color: rgb(199, 196, 196);
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
