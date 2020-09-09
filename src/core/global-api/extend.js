/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { defineComputed, proxy } from '../instance/state'
import { extend, mergeOptions, validateComponentName } from '../util/index'

export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this // 缓存Vue构造函数
    const SuperId = Super.cid // 拿到他的cid
    // 如果以前生成过，则将其的缓存返回，根据cid来进行标识
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      // 如果是开发环境要验证组件名称
      validateComponentName(name)
    }

    // 创建一个组件构造函数，基层子Vue构造函数，在其中调用 _init 方法，出option
    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype) // 赋予原型方法
    Sub.prototype.constructor = Sub // 声明 constructor 属性
    Sub.cid = cid++ // 将id++，用于缓存生成的组件
    // 合并两个配置项
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super // 添加一个super字段，存储Vue的构造函数

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    // 对于props和计算属性，在vue实例扩展的时候就进行拦截，这就就不用在每个实例创建的时候调用了
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    // 允许进一步扩展使用
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    // 把Vue实例的 'component','directive', 'filter' 赋值给扩展后的构造函数
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    // 启用递归自查询
    // 给新的构造函数的组件添加一个属性，让其可以查询到自己
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    // 保留一些引用，在以后如果Vue实例更新后可以获取到
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    // 缓存这个构造函数
    cachedCtors[SuperId] = Sub
    return Sub
  }
}

// 初始化props，拦截props
function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}

// 初始化计算属性，拦截计算属性
function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
