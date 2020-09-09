/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  // 'component','directive', 'filter'
  // 因为三个参数相同，所以可以同时注册
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        // 如果没有定义，则返回之前定义的方法，如果没有就是undefined
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        // 检查组件名称是否合格
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // 组件且定义是一个对象，则进行转换
        if (type === 'component' && isPlainObject(definition)) {
          // 格式化组件，添加名字，进行转换
          definition.name = definition.name || id
          // 组件配置转换为组件的构造函数 Vue.extend 方法
          definition = this.options._base.extend(definition)
        }
        // 指令且定义是一个方法，则进行转换
        if (type === 'directive' && typeof definition === 'function') {
          // 格式化指令
          definition = { bind: definition, update: definition }
        }
        // 全局注册，存储这些值
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
