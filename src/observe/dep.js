
let id = 0;

class Dep{
  constructor() {
    this.id = id++; // 属性的dep要收集watcher
    this.subs = []; // 这里存放着当前属性对应的watcher有哪些
  }

  depend() {
    // 这里不希望放重复的watcher，且只是一个单向的关系 dep -> watcher
    // watcher 记录dep
    // this.subs.push( Dep.target );
    Dep.target.addDep(this) // 让watcher记住dep

    // dep和watcher是一个多对多的关系（一个属性可以在多个组件中使用deo -> 多个watcher）
    // 一个组件中由多个属性组成（一个watcher对应多个dep）

  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  notify() {
    this.subs.forEach(watcher=>watcher.update()); // 调动watcher更新
  }

}

Dep.target = this;

export default Dep;
