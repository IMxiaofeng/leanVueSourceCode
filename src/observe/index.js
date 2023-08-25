
class Observer {
  constructor( data ) {
    // Obect.defineProperty只能劫持已经存在的属性，后增的，删除的，无法检测到（会有一些单独的api， $set, $delete）
    this.walk(data)
  }
  walk(data) { // 循环对象，对属性依次劫持
    // "重新定义"属性  性能差
    Object.keys(data).forEach(key=>defineReactive(data, key, data[key]))
  }
}

export function defineReactive(target, key, value) {
  observe( value ) // 对所有的对象都进行劫持
  Object.defineProperty(target, key, {
    get() { // 取值的时候执行
      return value
    },
    set(newValue) { // 修改值的时候执行
      if( newValue === value ) return
      observe(newValue)
      value = newValue
    }
  })
}

export function observe(data) {
  // 对相关对象进行劫持

  if( typeof data !== 'object' || data == null ){
    return // 只对 对象类型的数据进行劫持
  }

  // 如果一个对象被劫持过了，那就不需要再被劫持了
  // 要判断一个对象是否被劫持过，需要增加一个实例，用实例来判断是否被劫持过
  return new Observer(data)
}