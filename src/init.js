import { initState } from './state'

import { compileToFunction } from './compiler/index'

export function initMinix(Vue) {
  Vue.prototype._init = function(options) { // 初始化
    // vm.$options 获取配置
    //
    // 使用vue的时候，$nextTick, $data, $attr
    const vm = this
    vm.$options = options // 将用户选项挂载到实例上


    // 初始化状态
    initState( vm )


    if(options.el) {
      vm.$mount(options.el) // 数据挂载
    }
  }
  Vue.prototype.$mount = function(el) {
    const vm = this;
    el = document.querySelector(el);
    let ops = vm.$options;
    if( !ops.render ) { // 需要先看有没有使用render函数
      let template;  // 没有render要看是否用了template，如果没有template就使用外面的template
      if( !ops.template && el ) { // 没有写模板 但有 el的情况
        template = el.outerHTML
      }else {
        if(el) {
          template = ops.template
        }
      }

      // 如果存在template模板，就用已有的template模板
      if(template) {
        // 对模板进行编译
        const render = compileToFunction(template)
        ops.render = render; // jsx最终也会被编译成h('xxx')
      }

    }

    mountComponent(vm); // 组件的挂载

    // ops.render; // 统一成render,最终就可以获取render方法

    // 通过script标签引入的vue这个编译是在浏览器运行的
    // runtime是不包含模板编译的， 整个编译是在打包的时候通过loader编译.vue文件的，runtime是不能使用template模板的

  }
}



