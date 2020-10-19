/**
 * @desc    路由控制装饰器 Controller.js
 * @author  yijie
 * @date    2020-10-18 17:36
 * @logs[0] 2020-10-18 17:36 yijie 创建了Controller.js文件
 */
import Router from 'koa-router'

const Controller = (path: string = ''): ClassDecorator => {
  return (originClass: Function) => {
    if (global['$Quick-D'] === undefined) {
      global['$Quick-D'] = {}
      global['$Quick-D']['controllers'] = {}
    }
    global['$Quick-D']['controllers'][originClass.name] = originClass

    Reflect.defineMetadata('path', path, originClass)
    Reflect.defineMetadata('router', new Router(), originClass)
  }
}

export {
  Controller
}
