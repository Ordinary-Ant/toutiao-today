// 素材请求相关模块
import request from '@/utils/request'

// 上传用户图片素材
export const uploadImage = function (url = {}, method = 'GET', data) {
  return request({
    method,
    url,
    // 一般文件传都需要将请求头的content-type设置为multipart/form-data,
    // 但使用axios无需手动设置，只需要将给data一个FormData对象即可
    data
  })
}
