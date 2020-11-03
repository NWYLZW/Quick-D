/**
 * @desc    请求 Request.js
 * @author  yijie
 * @date    2020-10-19 17:26
 * @logs[0] 2020-10-19 17:26 yijie 创建了Request.js文件
 */

/**
 * 请求类型枚举
 */
class ReqMethod {
  static GET    = 'GET'
  static POST   = 'POST'
  static DELETE = 'DELETE'
  static PUT    = 'PUT'
}

/**
 * 获取路由注册装饰器
 * @param path        请求路径
 * @param reqMethods  请求类型数组
 * @returns {function({}, String, Object): void}
 */
const Request = (path: String = '', reqMethods: [String]): MethodDecorator => {
  for (let i = 0; i < reqMethods.length; i++) {
    reqMethods[i] = reqMethods[i].toLocaleLowerCase()
  }

  return (target: {}, methodName: String, method: Object) => {
    const originClass = target.constructor

    let routes = Reflect.getMetadata('routes', originClass)
    if (routes === undefined) {
      routes = {}
      Reflect.defineMetadata('routes', routes, originClass)
    }

    routes[methodName] = {
      path: path !== undefined ?path:`/${methodName}`,
      reqMethods: reqMethods !== undefined ?reqMethods:[ 'get' ],
      fun: method
    }
  }
}

/**
 * 获取GET请求装饰器
 * @param path  请求路径
 * @returns { MethodDecorator } 特殊的请求装饰器
 */
const GetRequest = (path: String) => {
  return Request(path, [ ReqMethod.GET ])
}

/**
 * 获取POST请求装饰器
 * @param path  请求路径
 * @returns { MethodDecorator } 特殊的请求装饰器
 */
const PostRequest = (path: String) => {
  return Request(path, [ ReqMethod.POST ])
}

/**
 * 获取DELETE请求装饰器
 * @param path  请求路径
 * @returns { MethodDecorator } 特殊的请求装饰器
 */
const DeleteRequest = (path: String) => {
  return Request(path, [ ReqMethod.DELETE ])
}

/**
 * 获取PUT请求装饰器
 * @param path  请求路径
 * @returns { MethodDecorator } 特殊的请求装饰器
 */
const PutRequest = (path: String) => {
  return Request(path, [ ReqMethod.PUT ])
}

export {
  Request, ReqMethod,
  GetRequest, PostRequest, DeleteRequest, PutRequest
}
