/**
 * @desc    参数装饰器 Param.js
 * @author  yijie
 * @date    2020-10-20 17:53
 * @logs[0] 2020-10-20 17:53 yijie 创建了Param.js文件
 */

/**
 * 获取请求中的Query参数
 * 当未使用生成模式时，自动装载全部query信息对象
 * @param name          {string}          query参数名
 * @param required      {boolean}         是否必须
 * @param defaultVal    {Object}          默认值
 * @param type          {Object}          校验数据类型 类(校验是否为实例化对象)
 * @param verification  {Function|RegExp} 校验数据格式
 * @param args          {any}             预留未来参数
 * @returns 返回一个从上下文中获取指定query参数值的装饰器
 */
const Query = (
  name: string, required: boolean,
  defaultVal: Object, type: Object, verification: Function|RegExp
  , ...args) => {
  let [ target, methodName, index ] = [ name, required, type, verification, ...args ]
  const decorator =  (target: Function , methodName: string, index: number) => {
    let queries = Reflect.getMetadata('queries', target[methodName])
    if (queries === undefined) {
      queries = []
      Reflect.defineMetadata('queries', queries, target[methodName])
    }
    queries.push({
      name, required, defaultVal, type, verification, index
    })
    Reflect.defineMetadata('queries', queries, target[methodName])
  }
  if (typeof target === 'object') {
    name = undefined
    required = undefined
    decorator(target, methodName, index)
    return
  }
  return decorator
}

/**
 * 获取Post请求中body中的参数
 * 当未使用生成模式时，自动装载body中的全部内容
 * @param name          {string}          body参数名
 * @param required      {boolean}         是否必须
 * @param defaultVal    {Object}          默认值
 * @param type          {Object}          校验数据类型 类(校验是否为实例化对象)
 * @param verification  {Function|RegExp} 校验数据格式
 * @param args          {any}             预留未来参数
 * @returns 返回一个从上下文中获取指定body参数值的装饰器
 */
const BodyParam = (
  name: string, required: boolean,
  defaultVal: Object, type: Object, verification: Function|RegExp
  , ...args) => {
  return (target: Function , methodName: string, index: number) => {
    let bodyParams = Reflect.getMetadata('bodyParams', target[methodName])
    if (bodyParams === undefined) {
      bodyParams = []
      Reflect.defineMetadata('bodyParams', bodyParams, target[methodName])
    }

    const checkInformation = { verification }
    if (verification !== undefined) {
      if (verification.constructor === Function) {
        checkInformation.type = 'function'
      } else if (verification.constructor === RegExp) {
        checkInformation.type = 'regex'
      } else {
        throw new TypeError()
      }
    }
    bodyParams.push({
      name, required, defaultVal, type, checkInformation, index
    })
    Reflect.defineMetadata('bodyParams', bodyParams, target[methodName])
  }
}

/**
 * 注入应用上下文
 */
const Context = () => {
}

/**
 * 注入应用实体
 */
const AppInstance = () => {
}

/**
 * 注入上下文中的 Request对象
 */
const QRequest = () => {
}

/**
 * 注入上下文中的 Response对象
 */
const QResponse = () => {
}

export {
  Context, AppInstance,
  QRequest, QResponse,
  Query, BodyParam
}
