import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
// Vue的构造函数
// 此处不使用class，是方便后面给Vue实例混入实例成员
function Vue (options) {
  // 需要使用new字段来调用，否则警告
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 调用注册方法
  this._init(options)
}

// 初始化 vm 实例的方法
// 注册 vm 的 _init 方法
initMixin(Vue)
// 注册 vm 的 $data/$props/$set/$delete/$watch 实例方法
stateMixin(Vue)
// 初始化事件相关方法 $on/$once/$off/$emit
eventsMixin(Vue)
// 初始化生命周期相关方法 _update/$forceUpdate/$destroy
lifecycleMixin(Vue)
// 初始化渲染相关的方法 $nextTick/_render
renderMixin(Vue)

export default Vue
