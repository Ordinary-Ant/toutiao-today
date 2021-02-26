// 基于axios和promise封装的异步请求模块

import axios from 'axios'
import JSONBig from 'json-bigint'

// 创建一个axios实例,之后发送请求时会以这个实例中的配置为基础。发送请求直接用request()即可
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/mp/', // 请求的基本路径
  // 自定义后端响应数据处理方式
  transformResponse: [function (data) {
    /**
     *  默认情况下，会将请求到的数据经过JSON.parse()返回，但如果得到的数据是int类型且同时这个数据的长度超过了int长度限制
     *  JSON.parse()就无法准确解析并返回
     *  解决方式：通过json-bigint第三方包的JSONBig.parse()代替JSON.parse()
     *  JSONBig.parse()会返回一个bignum对象，不会直接将数据给你，需要调用toString()方法
    **/
    // 如果后端返回的数据不是一个JSON.stringif()转换来的字符串，那么JSONBig.parse(data)会报错
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// axios的请求拦截器
request.interceptors.request.use(
  // 任何使用了request这个axios实例的请求都会被拦截
  // config是当前请求的配置信息(注意config可修改)，且此时请求还未发出
  config => {
    // 当你return后请求才会发出
    // 在此处统一设置用户的token
    // const useToken = JSON.parse(window.localStorage.getItem('user')).token
    // if (useToken) {
    //   config.headers.Authorization = `Bearer ${useToken}`
    // }
    return config
  }, error => {
    return Promise.reject(error)
  }
)

export default request
