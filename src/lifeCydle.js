
import { createElementVNode, createTextVNode } from './vdom'

import Watcher from './observe/watcher';

function createElm(vnode) {
  const { tag, data, children, text } = vnode;
  if( typeof tag === 'string' ) { // 标签
    vnode.el = document.createElement(tag); //这里把真实节点和虚拟节点对应起来，后续若修改属性

    patchProps(vnode.el, data)

    children.forEach(child => {
      vnode.el,appendChild( createElm(child) )
    });
  
  } else {
    vnode.el = document.createElement(text);
  }
  return vnode.el
}

function patchProps(el, props) {
  for( let key in props ) {
    if( key === 'style' ) { // 此时style格式是style: { color: 'red' }
      for(let styleName in props.style ) {
        el.style[styleName] = props.style[styleName]
      }
    }

    el.setAttribute(key, props[key])
  }
}


function patch(oldVNode, vnode) {
  // 写的是初渲染流程

  const isRealElement = oldVNode.nodeType
  if( isRealElement ) {
    const elm = oldVNode; // 获取真实元素

    const parentElm = elm.parentNode; // 拿到父元素
    let newElm = createElm(vnode);
    parentElm.insertBefore(newElm, elm.nextSibling)
    parentElm.removeChild(elm); //  删除老节点

    return newElm
  }else {
    // diff算法


  }

}

export function initLifeCycle(Vue) {
  Vue.prototype._update = function (vnode) { // 将细腻dom转化成真实dom
    const vm = this;
    const el = vm.$el;

    // patch既有初始化的功能，又有更新的功能
    vm.$el = patch(el, vnode)
  }

  // _c('div', {}, ...children)
  Vue.prototype._c = function(value) {
    if( typeof value !== 'object' ) return value
    return createElementVNode(this, ...arguments);
  }

  // _v(text)
  Vue.prototype._v = function() {
    return createTextVNode(this, ...arguments)
  }

  Vue.prototype._s = function(value) {
    return JSON.stringify(value)
  }

  Vue.prototype._render = function () {
    // const vm = this;

    // 让with中的this指向实例

    // 当渲染的时候会在实例中取值，就可以将属性和视图绑定
    return this.$options.render().call(this); // 通过ast语法转义后生成的render方法
  }

}


export function mountComponent(vm, el) { // 这里的el是通过querySelect处理过的
  vm.$el = el

  // 1. 调用render方法产生虚拟节点，虚拟DOM

  
  const updateComponent = () => {
    vm._update( vm._render() ); // vm.$options.render() 生成的是虚拟节点
  }

  const watcher = new Watcher(vm, updateComponent, true); // true用于标识是一个渲染watcher

  // 2. 根据虚拟DOM产生真是DOM


  // 3. 插入到el元素


}

/**
 * 1. 创建响应式数据
 * 
 * 2. 模板转换成ast语法树
 * 
 * 3. 将ast语法树转换了render函数
 * 
 * 4. 后续每次数据更新可以只执行render函数 无需再次执行ast转化的过程
 */

// render函数会产生虚拟节点（使用响应式数据）
// 根据生成的虚拟节点创造真实的DOM





