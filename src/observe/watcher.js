
import Dep from "./dep";

let id = 0;

/**
 * 1）. 当我们创建渲染watcher的时候我们会把当前的渲染watcher放到Dep.target上
 * 2）. 调用_render() 会取值， 轴到get上
 * 
 * 
 */

/**
 * 每个属性有一个dep（属性为被观察者），watcher为观察者（属性变化了会通知观察者来更新） -》 观察者模式
 * 
 */



class Watcher{ // 不同的组件有不同的watcher  目前只有一个  渲染根实例的 
  constructor(vm, fn, options) {
    this.id = id++;
    this.renderWatcher = options; // 是一个渲染watcher
    this.getter = fn; // getter意味着调用这个函数可以发生取值操作
    this.deps = []; //后续实现计算属性，和一些清理工作需要用到
    this.depsId = new Set()
    this.get()
  }

  addDep(dep) { // 一个组件 对应着多个属性 重复的属性也不用记录
    let id = dep.id;
    if( !this.depsId.has(id) ) {
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this); // watcher记录了dep且去重了，此时让dep也记住watcher
    }
  }

  get() {
    Dep.target = this; // 静态属性就是只有一份
    this.getter(); // 会去vm上取值
    Dep.target = null; // 渲染完毕后就清空
  }

  update() {
    queueWatcher(this); // 把当前的watcher暂存起来
    // this.get(); // 重新渲染
  }

  run() {
    this.get(); // 渲染的时候用的是最新的vm来渲染的
  }
}

let queue = [];
let has = {};
let pending = false; // 防抖

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0);
  pending = false;
  queue = [];
  has = {};
  flushQueue.forEach(q=>q.run()); // 在刷新的过程中可能还有新的watcher， 重新放到queue中
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if( !has[id] ) {
    queue.push(watcher);
    has[id] = true;
    // 不管updata执行多少次，但是只执行一轮刷新操作

    if(!pending) {
      nextTick(flushSchedulerQueue)
      pending = true;
    }

  }
}


let callbacks = [];
let waiting = false;

function flushCallbacks() {
  let cbs = callbacks.slice(0);
  waiting = false;
  callbacks = [];
  cbs.forEach(cb => cb()); // 按照顺序依次执行
}

// nextTick没有直接使用某个api，而是采用了优雅降级的方式
// 内部优先采用的promise（ie不兼容）=> MutationObserver(h5的api) => 可以考虑IE专享setImmediate => setTimeout

let timerFunc;
if(Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks);
  }
}else if( MutationObserver ) {
    let observer = new MutationObserver(flushCallbacks); // 这里传入的回调是异步执行的
    let textNode = document.createTextNode(1);
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = () => { 
      textNode.textContent = 2;
    }
  
}else if( setImmediate ) {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  }
}else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  }
}


export function nextTick(cb) { // 先内部还是先用户？
  callbacks.push(cb); // 维护nextTick中的callbacks方法
  if( !waiting ) {
    timerFunc()
    waiting = true;
  }
}


// 需要给每个属性增加一个dep， 目的就是收集watcher

// 一个视图中 有多少个属性（n个属性对应一个视图）， n个dep对应一个watcher
// 1个属性 对应多个组件 1个dep对应多个watcher
// 多对多的关系

export default Watcher