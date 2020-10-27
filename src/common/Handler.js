/**
 * @desc    处理器 Handler.js
 * @author  yijie
 * @date    2020-10-25 20:34
 * @logs[0] 2020-10-25 20:34 yijie 创建了Handler.js文件
 */

/**
 * 异常监听器
 */
class ErrorListener {
  isLogStack = false
}

/**
 * 异常处理器
 * @param errors  {Array<Error>}  处理的异常列表
 * @param weight  {Number}        处理权重
 */
const ErrorsHandler = (errors: Array<Error>, weight: Number) => {
  errors = errors ?? []
  weight = weight ?? 0
  return (target: Object, methodName: string, method: Function) => {
    const properties = [{
      name: '$Quick-D',
      default: {}
    }, {
      name: 'errorsHandlers',
      default: {}
    }, {
      name: target.constructor.name,
      default: target.constructor
    }]
    let baseObj = global
    properties.forEach(property => {
      baseObj[property.name] = baseObj[property.name] ?? property.default
      baseObj = baseObj[property.name]
    })

    let errorsHandlers = Reflect.getMetadata('errorsHandlers', ErrorListener)
    if (errorsHandlers === undefined) {
      errorsHandlers = []
      Reflect.defineMetadata('errorsHandlers', errorsHandlers, ErrorListener)
    }
    errorsHandlers.push({
      target, methodName,
      errors, weight
    })
    Reflect.defineMetadata('errorsHandlers', errorsHandlers, ErrorListener)
  }
}

export {
  ErrorListener,
  ErrorsHandler
}
