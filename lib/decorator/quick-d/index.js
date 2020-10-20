/**
 * @desc    对外导出 index.js
 * @author  yijie
 * @date    2020-10-19 17:27
 * @logs[0] 2020-10-19 17:27 yijie 创建了index.js文件
 */
import 'reflect-metadata'
import Koa from 'koa'
import koaBodyparser from 'koa-bodyparser'
import { Controller } from './common/Controller'
import  {
  Request, GetRequest, PostRequest
} from './common/Request'

let APP = undefined

const registerApp = (app: Koa) => {
  APP = app
  APP.use(koaBodyparser())

  const oldListen = APP.listen
  APP.listen = (...args) => {
    const controllers = global['$Quick-D']['controllers']
    for (const controllerName in controllers) {
      const controller = controllers[controllerName]
      const instance = new controller()

      const path = Reflect.getMetadata('path', controller)
      const router = Reflect.getMetadata('router', controller)
      const routes = Reflect.getMetadata('routes', controller)
      for (const methodName in routes) {
        const route = routes[methodName]
        route.method.forEach(reqMethod => {
          router[reqMethod](`${path}${route.path}`, async ctx => {
            const body = await instance[methodName](ctx)
            if (body !== undefined) {
              ctx.body = body
            }
          })
        })
        APP.use(router.routes())
        APP.use(router.allowedMethods())
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
