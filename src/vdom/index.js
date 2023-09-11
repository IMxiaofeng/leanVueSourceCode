
// h() _c()
export function createElementVNode(vm, tag, data, ...children) {

  if( !data ) {
    data = {}
  }

  let key = data.key
  if( key ) {
    delete data.key
  }

  return vnode(vm, tag, key, data, children);
}

// _v()
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

// 看起来跟ast一样？ 
/**
 * ast做的是语法层面的转化，它描述的是语法本身（可以描述js， css等语法本身）
 * 虚拟DOM描述的是dom元素, 可以增加一些自定义的属性 （可以秒速一个dom元素）
 * 
 */
function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
    // ......
  }
}

