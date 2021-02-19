// 基于axios和promise封装的异步请求模块

import axios from 'axios'

// 创建一个axios实例,之后发送请求时会以这个实例中的配置为基础。发送请求直接用request()即可
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/' // 请求的基本路径
})

export default request
