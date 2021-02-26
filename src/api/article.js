// 文章相关接口模块

import request from '@/utils/request'

// 获取文章列表
export const getArticle = (url, params = {}, method = 'GET') => {
  return request({
    method,
    url,
    // Body参数用data，Query参数用params，Headers参数用headers
    params
  })
}

// 获取文章频道
export const getArticleChannels = (url, method = 'GET') => {
  return request({
    method,
    url
  })
}

// 删除文章
export const delArticle = (url, method = 'GET') => {
  return request({
    method,
    url
  })
}
