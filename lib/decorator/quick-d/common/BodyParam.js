/**
 * @desc    参数装饰器 Param.js
 * @author  yijie
 * @date    2020-10-20 17:53
 * @logs[0] 2020-10-20 17:53 yijie 创建了Param.js文件
 */

/**
 * 获取校验数据
 * @param verification  {Function|RegExp} 校验数据格式
 * @returns {{verification: *}}
 */
const getCheckInformation = (verification: Function|RegExp) => {
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
  return checkInformation
}

/**
 * 获取请求中的Query参数
 * 当未使用生成模式时，自动装载全部query信息对象
 * @param alias         {string}          重命名query参数名
 * @param required      {boolean}         是否必须
 * @param defaultVal    {Object}          默认值
 * @param type          {Object}          校验数据类型 类(校验是否为实例化对象)
 * @param verification  {Function|RegExp} 校验数据格式
 * @param args          {any}             预留未来参数
 * @returns 返回一个从上下文中获取指定query参数值的装饰器
 */
const Query = (
  alias: string,required: boolean,
  defaultVal: Object, type: Object, verification: Function|RegExp
  , ...args) => {
  let [ target, methodName, index ] = [ alias, required, defaultVal, type, verification, ...args ]
  const decorator =  (target: Function , methodName: string, index: number) => {
    let queries = Reflect.getMetadata('queries', target[methodName])
    if (queries === undefined) {
      queries = []
      Reflect.defineMetadata('queries', queries, target[methodName])
    }

    queries.push({
      name: alias, required, defaultVal, type, index,
      checkInformation: getCheckInformation(verification)
    })
    Reflect.defineMetadata('queries', queries, target[methodName])
  }
  if (typeof target === 'object') {
    alias = undefined
    required = undefined
    defaultVal = undefined
    decorator(target, methodName, index)
    return
  }
  return decorator
}

/**
 * 获取Post请求中body中的参数
 * 当未使用生成模式时，自动装载body中的全部内容
 * @param alias          {string}         重命名body参数名
 * @param required      {boolean}         是否必须
 * @param defaultVal    {Object}          默认值
 * @param type          {Object}          校验数据类型 类(校验是否为实例化对象)
 * @param verification  {Function|RegExp} 校验数据格式
 * @param args          {any}             预留未来参数
 * @returns 返回一个从上下文中获取指定body参数值的装饰器
 */
const BodyParam = (
  alias: string, required: boolean,
  defaultVal: Object, type: Object, verification: Function|RegExp
  , ...args) => {
  return (target: Function , methodName: string, index: number) => {
    let bodyParams = Reflect.getMetadata('bodyParams', target[methodName])
    if (bodyParams === undefined) {
      bodyParams = []
      Reflect.defineMetadata('bodyParams', bodyParams, target[methodName])
    }

    bodyParams.push({
      name: alias, required, defaultVal, type, index,
      checkInformation: getCheckInformation(verification)
    })
    Reflect.defineMetadata('bodyParams', bodyParams, target[methodName])
  }
}

/**
 * 注入应用上下文
 */
const Context = (target: Function , methodName: string, index: number) => {
  Reflect.defineMetadata('ctxIndex', index, target[methodName])
}

/**
 * 注入应用实体
 */
const AppInstance = (target: Function , methodName: string, index: number) => {
  Reflect.defineMetadata('appInstanceIndex', index, target[methodName])
}

/**
 * 注入上下文中的 Request对象
 */
const QRequest = (target: Function , methodName: string, index: number) => {
  Reflect.defineMetadata('qRequestIndex', index, target[methodName])
}

/**
 * 注入上下文中的 Response对象
 */
const QResponse = (target: Function , methodName: string, index: number) => {
  Reflect.defineMetadata('qResponseIndex', index, target[methodName])
}

export {
  Context, AppInstance,
  QRequest, QResponse,
  Query, BodyParam
}
