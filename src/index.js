import { initMinix } from './init'

import { initLifeCycle } from './lifeCydle'


function Vue(options) {
    this._init(options)
}

initMinix(Vue)

initLifeCycle(Vue)

export default Vue