// 基于axios和promise封装的异步请求模块

import axios from 'axios'

// 创建一个axios实例,之后发送请求时会以这个实例中的配置为基础。发送请求直接用request()即可
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/' // 请求的基本路径
})

// axios的请求拦截器
request.interceptors.request.use(
  // 任何使用了request这个axios实例的请求都会被拦截
  // config是当前请求的配置信息(注意config可修改)，且此时请求还未发出
  config => {
    // 当你return后请求才会发出
    // 在此处统一设置用户的token
    const useToken = JSON.parse(window.localStorage.getItem('user')).token
    if (useToken) {
      config.headers.Authorization = `Bearer ${useToken}`
    }
    return config
  }, error => {
    return Promise.reject(error)
  }
)

export default request
