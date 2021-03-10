// 全局通信总线 呼叫中心 用于组件间的通信

import Vue from 'vue'

export default new Vue()

/**
 * 假设a要向b发送数据
 * b注册通信事件
 * import globalBus from '@/util/global-bus'
 * globalBus.$on('自定义事件',(data) => {
 *   处理函数
 * })
 * a发布通信事件
 * import globalBus from '@/util/global-bus'
 * globalBus.$emit('自定义事件',数据)
 */
