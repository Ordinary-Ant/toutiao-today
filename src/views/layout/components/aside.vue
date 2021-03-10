<template>
  <el-menu
    :default-active="this.$route.path"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    class="menu"
    :collapse="isCollapse"
  >
    <el-menu-item index="/layout">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/layout/article">
      <i class="el-icon-document"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/layout/image">
      <i class="el-icon-picture"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/layout/publish">
      <i class="el-icon-upload"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/layout/comment">
      <i class="el-icon-warning"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/layout/fans">
      <i class="el-icon-star-on"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/layout/settings">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  name: 'AsideIndex',
  data () {
    return {
    }
  },
  props: {
    isCollapse: Boolean
  },
  methods: {
  }
}
</script>
<style lang="less">
.menu{
  border-right:0!important
}
</style>
