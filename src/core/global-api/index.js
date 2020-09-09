/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

// 给Vue添加静态属性
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  // 给Vue添加config属性
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 这些方法不适合全局API，调用他们会有风险
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  // 定义全局静态API方法
  Vue.set = set // 添加响应式数据
  Vue.delete = del // 删除响应式数据
  Vue.nextTick = nextTick // 立即更新dom

  // 2.6 explicit observable API
  // 设置响应式数据
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  // 注册 Vue.options 对象，并且添加一些扩展
  Vue.options = Object.create(null)
  // 'component','directive', 'filter'
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // weex相关的配置
  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  // 设置keep-alive 组件，builtInComponents vue自带组件集合，目前只有 keep-alive 组件
  extend(Vue.options.components, builtInComponents)

  // 注册Vue.use 使用Vue.use()来注册插件
  initUse(Vue)

  // 注册Vue.mixin 使用Vue.mixin()实现混入
  initMixin(Vue)

  // 注册Vue.extend 使用Vue.extend()给予传入的options返回一个组件的构造函数
  initExtend(Vue)

  // 注册'component','directive', 'filter'
  // 使用Vue.directive()来注册指令
  // 使用Vue.component()来注册组件
  // 使用Vue.filter()来注册或获取全局过滤器
  initAssetRegisters(Vue)
}
