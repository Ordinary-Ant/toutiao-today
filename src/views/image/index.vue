<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <image-list />
      </div>
    </el-card>
  </div>
</template>
<script>
import ImageList from './component/image-list.vue'
export default {
  name: 'Images',
  components: {
    ImageList
  }
}
</script>
<style lang="less">
// .text {
//     font-size: 14px;
// }
// .item {
//   margin-bottom: 18px;
// }
// .clearfix:before,
// .clearfix:after {
//   display: table;
//   content: "";
// }
// .clearfix:after {
//   clear: both
// }
</style>
