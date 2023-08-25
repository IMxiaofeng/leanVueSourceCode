
import { observe } from './observe/index'

export function initState( vm ) {
  const opts = vm.$options; // 获取所有选项
  if( opts.data ) {
    initData(vm)
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, { // vm.name
    get() {
      return vm[target][key]   // vm._data.name
    },
    set(newValue) {
      vm[target][key] = newValue
    }
  })
}

function initData(vm) {
  let data = vm.$options.data; // 注意： data 可能是函数和对象
  data = typeof data === 'function' ? data.call(this) : data // data是返回的对象
  vm._data = data // 将返回的data放到_data上
  // 对数据进行劫持，Vue2中的 defineProperty
  observe( data )

  //将vm._data 用vm来代理就可以了
  for(let key in data) {
    proxy(vm, '_data', key)
  }
}