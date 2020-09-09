/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // 将传入option合并近Vue上的option中
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
