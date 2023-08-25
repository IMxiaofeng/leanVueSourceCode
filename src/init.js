
import { initState } from './state'

export function initMinix(Vue) {
  Vue.prototype._init = function(options) { // 初始化
    // vm.$options 获取配置
    //
    // 使用vue的时候，$nextTick, $data, $attr
    const vm = this
    vm.$options = options // 将用户选项挂载到实例上


    // 初始化状态
    initState( vm )
  }
}
