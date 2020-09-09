/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) { // 传入插件
    // 判断插件是否安装过，插件安装之后会放在 _installedPlugins 属性中
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    // 把参数数组中第一项plugin去掉， 并且插入this
    const args = toArray(arguments, 1)
    args.unshift(this)

    // 插件是对象，则install属性为一个方法，则执行install
    // 如果是一个方法就直接执行
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }

    // 将安装过过的插件放入数组中
    installedPlugins.push(plugin)
    return this
  }
}
