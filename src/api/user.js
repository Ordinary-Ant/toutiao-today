// 用户相关请求模块
import request from '@/utils/request'

// 用户登录
export const login = (url, data = {}, method = 'GET') => {
  return request({
    method,
    url,
    data
  })
}

// 更新用户token，需要把需要授权的认证身份放入请求头
export const updateUserProfile = (url, method = 'GET') => {
  return request({
    method,
    url
    // 因为通过axios拦截器统一配置了Authorization，此处无需再配置
    // headers: {
    //   // 格式要求：Authorization:'Bearer token数据'
    //   Authorization
    // }
  })
}
