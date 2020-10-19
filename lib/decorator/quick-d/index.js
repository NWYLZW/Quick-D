/**
 * @desc    对外导出 index.js
 * @author  yijie
 * @date    2020-10-19 17:27
 * @logs[0] 2020-10-19 17:27 yijie 创建了index.js文件
 */
import 'reflect-metadata'
import { Controller } from './common/Controller'
import  {
  Request, GetRequest, PostRequest
} from './common/Request'

let APP = undefined

const registerApp = app => {
  APP = app
  const oldListen = APP.listen
  APP.listen = (...args) => {
    const controllers = global['$Quick-D']['controllers']
    for (const controllerName in controllers) {
      const controller = controllers[controllerName]

      const path = Reflect.getMetadata('path', controller)
      const router = Reflect.getMetadata('router', controller)
      const routes = Reflect.getMetadata('routes', controller)
      for (const routeName in routes) {
        const route = routes[routeName]
        console.log('routeName', route)
      }
    }
    oldListen.call(APP, ...args)
  }
}

export {
  APP,
  registerApp, Controller,
  Request, GetRequest, PostRequest
}
