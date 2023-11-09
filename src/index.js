import { initMinix } from './init'

import { initLifeCycle } from './lifeCydle'

import { nextTick } from './observe/watcher'


function Vue(options) {
    this._init(options)
}

Vue.prototype.$nextTick = nextTick

initMinix(Vue)

initLifeCycle(Vue)

export default Vue