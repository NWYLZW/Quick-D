/**
 * @desc    请求 Request.js
 * @author  yijie
 * @date    2020-10-19 17:26
 * @logs[0] 2020-10-19 17:26 yijie 创建了Request.js文件
 */

const Request = (path: string = '', reqMethods: string[]): MethodDecorator => {
  for (let i = 0; i < reqMethods.length; i++) {
    reqMethods[i] = reqMethods[i].toLocaleLowerCase()
  }

  return (target: {}, methodName: string, method: Object) => {
    const originClass = target.constructor

    let routes = Reflect.getMetadata('routes', originClass)
    if (routes === undefined) {
      routes = {}
      Reflect.defineMetadata('routes', routes, originClass)
    }

    routes[methodName] = {
      path: path !== undefined ?path:`/${methodName}`,
      method: reqMethods !== undefined ?reqMethods:[ 'get' ],
      fun: method
    }
  }
}

const GetRequest = (path: String) => {
  return Request(path, ['GET'])
}

const PostRequest = (path: String) => {
  return Request(path, ['POST'])
}

const DeleteRequest = (path: String) => {
  return Request(path, ['DELETE'])
}

const PutRequest = (path: String) => {
  return Request(path, ['PUT'])
}

export {
  Request,
  GetRequest, PostRequest, DeleteRequest, PutRequest
}
