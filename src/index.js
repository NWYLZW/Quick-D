/**
 * @desc    对外导出 index.js
 * @author  yijie
 * @date    2020-10-19 17:27
 * @logs[0] 2020-10-19 17:27 yijie 创建了index.js文件
 */
import 'reflect-metadata'
import Koa from 'koa'
import koaBodyparser from 'koa-bodyparser'

import TypeNotSatisfyError from './error/TypeNotSatisfyError'
import ValueNotDeliveredError from './error/ValueNotDeliveredError'
import FormatNotMatchError from './error/FormatNotMatchError'
import removeComments from './tool/removeComments'

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
    const controllers = (global?.['$Quick-D'] ?? {
      controllers: []
    }).controllers
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
              method        = instance[methodName],
              argNames      = method.toString()
                .match(/.*?\(([^)]*)\)/)[1].split(",").map(arg => {
                return removeComments(arg).trim()
              }).filter(arg => {
                return arg
              }),
              body          = ctx.request.body,
              query         = ctx.request.query

            const reflectDatas = [{
              name: 'queries',
              data: query
            }, {
              name: 'bodyParams',
              data: body
            }]

            // 将请求中的数据装载到对应的参数位置中去
            reflectDatas.forEach(reflectData => {
              const methodParams = Reflect
                .getMetadata(reflectData.name, method)

              for (let i = 0;methodParams && i < methodParams.length;i++) {
                const methodParam = methodParams[i]

                // 若未设置name属性，使用变量名作为默认name
                if (methodParam.name === undefined) {
                  methodParam.name = argNames[methodParam.index]
                }
                if (
                  methodParam.defaultVal !== undefined &&
                  reflectData.data[methodParam.name] === undefined
                ) {
                  reflectData.data[methodParam.name] = methodParam.defaultVal
                }

                if (
                  methodParam.required &&
                  reflectData.data[methodParam.name] === undefined
                ) {
                  throw new ValueNotDeliveredError()
                }

                if (
                  methodParam.type !== undefined &&
                  reflectData.data[methodParam.name].constructor !== methodParam.type) {
                  throw new TypeNotSatisfyError()
                }

                if (
                  methodParam
                    .checkInformation.verification !== undefined
                ) {
                  if (methodParam.checkInformation.type === 'function') {
                    if (!methodParam.checkInformation.verification(reflectData.data[methodParam.name])) {
                      throw new FormatNotMatchError()
                    }
                  } else if (methodParam.checkInformation.type === 'regex') {
                    if (!methodParam.checkInformation.verification.test(reflectData.data[methodParam.name])) {
                      throw new FormatNotMatchError()
                    }
                  } else {
                    throw new TypeError()
                  }
                }

                instanceArgs[methodParam.index] = reflectData.data[methodParam.name]
              }
            })

            const indexDatas = [{
              name: 'ctxIndex',
              instance: ctx
            }, {
              name: 'appInstanceIndex',
              instance: ctx.app
            }, {
              name: 'qRequestIndex',
              instance: ctx.request
            }, {
              name: 'qResponseIndex',
              instance: ctx.response
            }]
            indexDatas.forEach(indexData => {
              const index = Reflect
                .getMetadata(indexData.name, method)
              if (index !== undefined) {
                instanceArgs[index] = indexData.instance
              }
            })

            let returnBody
            if (instanceArgs.length === 0) {
              returnBody = await method(ctx)
            } else {
              returnBody = await method(...instanceArgs)
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
  APP, registerApp
}
