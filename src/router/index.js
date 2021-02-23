import Vue from 'vue'
import VueRouter from 'vue-router'
// @在cli创建的项目中表示src目录
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/layout',
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: '/layout/article',
        name: 'Article',
        component: Article
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫(即页面跳转路由跳转都会被此守卫拦截)
// to: Route: 即将要进入的目标 路由对象
// from: Route: 当前路由对象
// next: Function: 必须调用该方法来放行这个钩子。执行效果依赖 next 方法的调用参数(简单来说就是放行方法)
//  next(): 进行管道中的下一个钩子
//  next(false): 中断当前的导航
//  next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址
//  next(error):如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。
router.beforeEach((to, from, next) => {
  // 如果用户未能验证身份，则会跳转到login(接口写完后放开)
  // if (to.name !== 'Login' && !JSON.parse(window.localStorage.getItem('user'))) next({ name: 'Login' })
  next()
})
export default router
