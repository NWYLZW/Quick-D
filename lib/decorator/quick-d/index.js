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
import {
  Request, GetRequest, PostRequest
} from './common/Request'
import {
  Context, AppInstance,
  QRequest, QResponse,
  Query, BodyParam
} from './common/BodyParam'

import TypeNotSatisfyError from './error/TypeNotSatisfyError'
import ValueNotDeliveredError from './error/ValueNotDeliveredError'
import FormatNotMatchError from './error/FormatNotMatchError'

/**
 * 接收主程序传来的 APP 实体
 */
let APP = undefined

/**
 * 反射获取controller中的数据
 * @param controller  路由控制层对象
 * @returns {{path: any, routes: any, router: any}}
 */
const reflectGetData = controller => {
  return {
    path    : Reflect.getMetadata('path',   controller),
    router  : Reflect.getMetadata('router', controller),
    routes  : Reflect.getMetadata('routes', controller)
  }
}

/**
 * 为框架注册 koa应用实体
 * @param app koa应用实体
 */
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
              instanceArgs  = [],
              body          = ctx.request.body,
              query         = ctx.request.query

            // 获取路由Query装饰器中的参数信息字典
            // 并将请求中的数据自动装载到对应的参数位置中去
            // 没有设置参数信息时，装载所有query信息
            const methodQueries = Reflect
              .getMetadata('queries', instance[methodName])
            for (let i = 0;methodQueries && i < methodQueries.length;i++) {
              const methodQuery = methodQueries[i]

              if (methodQuery.name === undefined) {
                instanceArgs[methodQuery.index] = { ...query }
              } else {
                if (
                  methodQuery.defaultVal !== undefined  &&
                  body[methodQuery.name] === undefined
                ) {
                  body[methodQuery.name] = methodQuery.defaultVal
                }

                if (
                  methodQuery.required &&
                  query[methodQuery.name] === undefined
                ) {
                  throw new ValueNotDeliveredError()
                }

                if (
                  methodQuery.type !== undefined &&
                  body[methodQuery.name].constructor !== methodQuery.type) {
                  throw new TypeNotSatisfyError()
                }

                if (
                  methodQuery
                    .checkInformation.verification !== undefined
                ) {
                  if (methodQuery.checkInformation.type === 'function') {
                    if (!methodQuery.checkInformation.verification(body[methodBodyParam.name])) {
                      throw new FormatNotMatchError()
                    }
                  } else if (methodQuery.checkInformation.type === 'regex') {
                    if (!methodQuery.checkInformation.verification.test(body[methodBodyParam.name])) {
                      throw new FormatNotMatchError()
                    }
                  } else {
                    throw new TypeError()
                  }
                }

                instanceArgs[methodQuery.index] = query[methodQuery.name]
              }
            }

            // 获取BodyParam装饰器中的参数信息字典
            // 并将请求中的数据装载到对应的参数位置中去
            const methodBodyParams = Reflect
              .getMetadata('bodyParams', instance[methodName])
            for (let i = 0;methodBodyParams && i < methodBodyParams.length;i++) {
              const methodBodyParam = methodBodyParams[i]
              if (
                methodBodyParam.defaultVal !== undefined  &&
                body[methodBodyParam.name] === undefined
              ) {
                body[methodBodyParam.name] = methodBodyParam.defaultVal
              }

              if (
                methodBodyParam.required &&
                body[methodBodyParam.name] === undefined
              ) {
                throw new ValueNotDeliveredError()
              }

              if (
                methodBodyParam.type !== undefined &&
                body[methodBodyParam.name].constructor !== methodBodyParam.type
              ) {
                throw new TypeNotSatisfyError()
              }

              if (
                methodBodyParam
                  .checkInformation.verification !== undefined
              ) {
                if (methodBodyParam.checkInformation.type === 'function') {
                  if (!methodBodyParam.checkInformation.verification(body[methodBodyParam.name])) {
                    throw new FormatNotMatchError()
                  }
                } else if (methodBodyParam.checkInformation.type === 'regex') {
                  if (!methodBodyParam.checkInformation.verification.test(body[methodBodyParam.name])) {
                    throw new FormatNotMatchError()
                  }
                } else {
                  throw new TypeError()
                }
              }

              instanceArgs[methodBodyParam.index] = body[methodBodyParam.name]
            }

            let returnBody
            if (instanceArgs.length === 0) {
              returnBody = await instance[methodName](ctx)
            } else {
              returnBody = await instance[methodName](...instanceArgs)
            }
            if (returnBody !== undefined) {
              ctx.body = returnBody
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

  Context, AppInstance,
  QRequest, QResponse,
  Query, BodyParam
}
