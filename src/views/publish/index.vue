<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="publish-form" :model="article" label-width="80px" :rules="formRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap v-model="article.content" :extensions="extensions" lang="zh" height="400" placeholder="请输入内容"></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>

          <!--
            如果事件函数手动传入了参数，那么事件函数默认本身的参数就会被覆盖，需要再传一个$event参数
            @update-cover="onUpdateCover(index,$event)"
            :cover-image="article.cover.images[index]"
            以上两行代码的简写方式：
              v-model="article.cover.images[index]
              == :value="article.cover.images[index]" + @input="article.cover.images[index]"
          -->
          <template v-if="article.cover.type > 0">
            <ArticleCover
              v-for="(cover,index) in article.cover.type"
              :key="cover"
              v-model="article.cover.images[index]"
            />
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option :label="channel.name" :value="channel.id" v-for="(channel,index) in channels" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{$route.query.id ? '编辑' : '发表'}}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getArticleChannels, publishArticle, getArticleById, editArticle } from '@/api/article'
import { uploadImage } from '@/api/images'
import {
  // 需要的 extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  Image,
  Preview,
  TextColor,
  CodeView,
  Iframe,
  CodeBlock
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import ArticleCover from './component/article-cover.vue'

export default {
  name: 'publish',
  data () {
    return {
      // 文章表单内容
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          type: 0, // 封面类型 -1自动 0无图 1单图 2三图
          images: [] // 封面图地址
        },
        channel_id: null
      },
      channels: [], // 文章频道列表
      defaultChannels: [ // 默认文章频道列表
        { id: 0, name: 'javaScript' }, { id: 1, name: 'Vue' }, { id: 2, name: 'React' }, { id: 3, name: 'TypeScript' }
      ],
      // element-tiptap所需数据
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Image({
          // 此对象自带的一个配置参数，可以修改上传图片的请求数据
          uploadRequest (file) {
            // 想要将图片或者上传文件通过异步请求，需要将其转换为FormData包装的数据
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage('/v1_0/user/images', 'POST', fd).then(
              res => {
                return res.data.data.url
              }
            )
          }
        }),
        new Preview(),
        new TextColor(),
        new CodeView(),
        new Iframe(),
        new CodeBlock()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度为5到30之间', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          }
        ],
        channel_id: [
          { required: true, message: '请选择频道', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 编辑状态
    if (this.$route.query.id) {
      getArticleById(`/v1_0/articles/${this.$route.query.id}`).then(res => {
        this.article = res.data.data
      }).catch(error => {
        console.log(error)
      })
    }

    // 获取频道
    getArticleChannels('/v1_0/channels').then(res => {
      this.channels = res.data.data.channels
    }).catch(err => {
      console.log(err)
    })
  },

  methods: {
    // 发布或编辑发布文章
    onPublish (draft) {
      // 验证表单
      this.$refs['publish-form'].validate(valid => {
        // 不通过
        if (!valid) {
          return
        }
        // 通过
        if (this.$route.query.id) {
          editArticle(`/v1_0/articles/${this.$route.query.id}`, this.article, 'PUT', draft).then(() => {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.$router.push('/layout/article')
          }).catch(() => {
            this.$message.error('编辑失败，请重试')
            this.$router.push('/layout/article')
          })
        } else {
          publishArticle('/v1_0/articles', this.article, 'POST', draft).then(() => {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
            this.$router.push('/layout/article')
          }).catch(() => {
            this.$message.error('发布失败，请重试')
            this.$router.push('/layout/article')
          })
        }
      }
      )
    },

    // 接收子组件中传递的cover url
    onUpdateCover (index, url) {
      this.article.cover.images[index] = url
    }
  },

  components: {
    ArticleCover,
    'el-tiptap': ElementTiptap
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
</style>
