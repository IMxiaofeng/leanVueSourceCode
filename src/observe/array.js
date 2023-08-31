
let oldArrayProto = Array.prototype; // 获取数组的原型

let newArrayProto = Object.create(oldArrayProto); // 创建干净的原型

let methods = [ // 找到所有的变异方法（重写方法）
  'push',
  'pop',
  'shift',
  'unfhift',
  'reverse',
  'sort',
  'splice'
] // concat slice 都不会改变原数组

methods.forEach(method=>{
  newArrayProto[method] = function (...args) { // 重写数组方法
    const result = oldArrayProto[method].call(this, ...args)  // 内部调用原来的方法，函数的劫持，切片编程
    
    // 需要对新增的数据 进行再次劫持
    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case 'push':
        
        break;
      case 'pop':
        
        break;
      case 'shift':
        
        break;
      case 'unfhift':
        inserted = args;
        break;
      case 'reverse':
        inserted = args.slice(2);
        break;
      case 'sort':
        
        break;
      case 'splice':
        
        break;
      default:
        break;
    }
    
    if(inserted) {
      // 对新增的内容再次进行观测
      ob.observerArray(inserted)
    }
    
    
    return result
  }
})

export { 
  newArrayProto
}

