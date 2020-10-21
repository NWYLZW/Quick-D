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
import {
  Query
} from '~/lib/decorator/quick-d/common/Param'

class ValueNotDeliveredError extends Error {
  constructor (message) {
    super(message);
    this.name = 'ValueNotDeliveredError'
    this.message = message || 'Value is required,but not delivered'
    this.stack = (new Error()).stack
  }
}

let APP = undefined

const reflectGetData = controller => {
  return {
    path    : Reflect.getMetadata('path',   controller),
    router  : Reflect.getMetadata('router', controller),
    routes  : Reflect.getMetadata('routes', controller)
  }
}

const registerApp = (app: Koa) => {
  APP = app
  APP.use(koaBodyparser())

  const oldListen = APP.listen
  APP.listen = (...args) => {
    const controllers = global['$Quick-D']['controllers']
    for (const controllerName in controllers) {
      const controller = controllers[controllerName]
      const instance = new controller()

      const {
        path, router, routes
      } = reflectGetData(controller)

      for (const methodName in routes) {
        const route = routes[methodName]
        route.reqMethods.forEach(reqMethod => {
          router[reqMethod](`${path}${route.path}`, async ctx => {
            const
              instanceArgs = [], query = ctx.request.query

            const methodQueries = Reflect.getMetadata('queries', instance[methodName])
            for (let i = 0;methodQueries && i < methodQueries.length;i++) {
              const methodQuery = methodQueries[i]

              if (methodQuery.name === undefined) {
                instanceArgs[methodQuery.index] = {...query}
              } else {
                if (
                  methodQuery.required &&
                  query[methodQuery.name] === undefined
                ) {
                  throw new ValueNotDeliveredError()
                }
                instanceArgs[methodQuery.index] = query[methodQuery.name]
              }
            }

            let body
            if (instanceArgs.length === 0) {
              body = await instance[methodName](ctx)
            } else {
              body = await instance[methodName](...instanceArgs)
            }
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
  Request, GetRequest, PostRequest,
  Query
}
