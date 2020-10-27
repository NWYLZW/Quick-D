/**
 * @desc    路由控制装饰器 Controller.js
 * @author  yijie
 * @date    2020-10-18 17:36
 * @logs[0] 2020-10-18 17:36 yijie 创建了Controller.js文件
 */
import Router from 'koa-router'

/**
 * 根据参数路由控制器装饰器
 * @param path  子路由的基础路径
 * @returns {function(Function): void} 路由控制器装饰器
 * @constructor
 */
const Controller = (path: string = ''): ClassDecorator => {
  return (originClass: Function) => {
    const properties = [{
      name: '$Quick-D',
      default: {}
    }, {
      name: 'controllers',
      default: {}
    }, {
      name: originClass.name,
      default: originClass
    }]
    let baseObj = global
    properties.forEach(property => {
      baseObj[property.name] = baseObj[property.name] ?? property.default
      baseObj = baseObj[property.name]
    })

    Reflect.defineMetadata('path', path, originClass)
    Reflect.defineMetadata('router', new Router(), originClass)
  }
}

export {
  Controller
}
