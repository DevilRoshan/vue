/* @flow */

import Vue from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser } from 'core/util/index'

import {
  query, // 转化el，如果是选择器则转化为dom
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'

// install platform specific utils
// 注册一系列方法，工具方法
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag // 判断是否是保留的标签
Vue.config.isReservedAttr = isReservedAttr // 判断是否是保留的属性
Vue.config.getTagNamespace = getTagNamespace // 获取命名空间
Vue.config.isUnknownElement = isUnknownElement // 判断是否是不认识的元素

// install platform runtime directives & components
// 注册组件和指令
// extend 合并对西那个
extend(Vue.options.directives, platformDirectives) // 指令
extend(Vue.options.components, platformComponents) // 组件

// install platform patch function
// 原型上添加将虚拟dom转化为真实dom的函数
// 如果是浏览器则添加转化dom的方法，否则，就添加一个空方法
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
// 给原型上添加 $mount 方法，用于挂载dom
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// devtools global hook
// 调试相关的代码
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test'
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
        `Make sure to turn on production mode when deploying for production.\n` +
        `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}

export default Vue
