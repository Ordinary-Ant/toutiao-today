// 文章相关接口模块

import request from '@/utils/request'

// 获取文章列表
export const getArticle = (url, params = {}, method = 'GET') => {
  console.log('111')
  return request({
    method,
    url,
    // Body参数用data，Query参数用params，Headers参数用headers
    params
  })
}
