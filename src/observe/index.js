
import { newArrayProto } from './array'

import Dep from './dep'

class Observer {
  constructor( data ) {
    // Obect.defineProperty只能劫持已经存在的属性，后增的，删除的，无法检测到（会有一些单独的api， $set, $delete）
    // data.__ob__ = this // 也相当于给数据加了个标识，如果带有__ob__属性，则说明数据已经做过监听劫持
    // 这里要考虑data是个对象的话，劫持就会进入死循环，所以要讲其变成不可枚举
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })

    if( Array.isArray(data) ) {
      // 这里考虑用户的操作习惯，对数组的一些方法进行重写

      data.__proto__ = newArrayProto
      this.observerArray(data)
    } else {
      this.walk(data)
    }
  }
  walk(data) { // 循环对象，对属性依次劫持
    // "重新定义"属性  性能差
    Object.keys(data).forEach(key=>defineReactive(data, key, data[key]))
  }
  observerArray(data) { // 观测数组
    data.forEach(item=>observe(item))
  }
}

export function defineReactive(target, key, value) {
  observe( value ) // 对所有的对象都进行劫持
  let dep = new Dep(); // 每个属性都有一个dep
  Object.defineProperty(target, key, {
    get() { // 取值的时候执行get

      if( Dep.target ){
        dep.depend(); // 让这个属性的收集器记住当前的watcher
      }


      return value
    },
    set(newValue) { // 修改值的时候执行
      if( newValue === value ) return
      observe(newValue)
      value = newValue;
      dep.notify(); // 通知更新
    }
  })
}

export function observe(data) {
  // 对相关对象进行劫持

  if( typeof data !== 'object' || data == null ){
    return // 只对 对象类型的数据进行劫持
  }

  if( data.__ob__ instanceof Observer ) {
    return data.__ob__; // 说明对象被代理过了
  }

  // 如果一个对象被劫持过了，那就不需要再被劫持了
  // 要判断一个对象是否被劫持过，需要增加一个实例，用实例来判断是否被劫持过
  return new Observer(data)
}