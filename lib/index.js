"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerApp = void 0;

require("reflect-metadata");

var _koa = _interopRequireDefault(require("koa"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _TypeNotSatisfyError = _interopRequireDefault(require("./error/TypeNotSatisfyError"));

var _ValueNotDeliveredError = _interopRequireDefault(require("./error/ValueNotDeliveredError"));

var _FormatNotMatchError = _interopRequireDefault(require("./error/FormatNotMatchError"));

var _removeComments = _interopRequireDefault(require("./tool/removeComments"));

var _Handler = require("./common/Handler");

/**
 * @desc    对外导出 index.js
 * @author  yijie
 * @date    2020-10-19 17:27
 * @logs[0] 2020-10-19 17:27 yijie 创建了index.js文件
 */

/**
 * 反射获取controller中的数据
 * @param controller  路由控制层对象
 * @returns {{path: any, routes: any, router: any}}
 */
const reflectGetData = controller => {
  return {
    path: Reflect.getMetadata('path', controller),
    router: Reflect.getMetadata('router', controller),
    routes: Reflect.getMetadata('routes', controller)
  };
};
/**
 * 为框架注册 koa应用实体
 * @param app           {Koa}           koa应用实体
 */


const registerApp = app => {
  // 添加全局的异常处理
  app.use(async (ctx, next) => {
    var _Reflect$getMetadata;

    const errorsHandlers = ((_Reflect$getMetadata = Reflect.getMetadata('errorsHandlers', _Handler.ErrorListener)) !== null && _Reflect$getMetadata !== void 0 ? _Reflect$getMetadata : []).sort((a, b) => {
      return a.weight > b.weight ? -1 : 1;
    });

    try {
      await next();
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: e.statusCode || e.status || 500,
        message: e.message
      };
      let isPrintStack = false;

      if ((errorsHandlers !== null && errorsHandlers !== void 0 ? errorsHandlers : []).length === 0) {
        isPrintStack = new _Handler.ErrorListener().isLogStack;
      } else {
        errorsHandlers.forEach(errorsHandler => {
          var _errorsHandler$errors;

          const instance = new errorsHandler.target.constructor();
          const errors = (_errorsHandler$errors = errorsHandler === null || errorsHandler === void 0 ? void 0 : errorsHandler.errors) !== null && _errorsHandler$errors !== void 0 ? _errorsHandler$errors : [];
          isPrintStack = instance.isLogStack;
          errors.forEach(error => {
            if (error === e.constructor) {
              instance[errorsHandler.methodName]([ctx, e]);
            }
          });
        });
      }

      if (isPrintStack) {
        ctx.body.stack = e.stack;
      }

      ctx.app.emit('catch-error', [ctx, e]);
    }
  });
  app.use((0, _koaBodyparser.default)());
  const oldListen = app.listen;

  app.listen = (...args) => {
    var _global$$QuickD, _global;

    const controllers = ((_global$$QuickD = (_global = global) === null || _global === void 0 ? void 0 : _global['$Quick-D']) !== null && _global$$QuickD !== void 0 ? _global$$QuickD : {
      controllers: []
    }).controllers;

    for (const controllerName in controllers) {
      const controller = controllers[controllerName];
      const instance = new controller();
      const {
        path,
        router,
        routes
      } = reflectGetData(controller);

      for (const methodName in routes) {
        const route = routes[methodName];
        route.reqMethods.forEach(reqMethod => {
          router[reqMethod](`${path}${route.path}`, async ctx => {
            const instanceArgs = [],
                  method = instance[methodName],
                  argNames = method.toString().match(/.*?\(([^)]*)\)/)[1].split(",").map(arg => {
              return (0, _removeComments.default)(arg).trim();
            }).filter(arg => {
              return arg;
            }),
                  body = ctx.request.body,
                  query = ctx.request.query;
            const reflectDatas = [{
              name: 'queries',
              data: query
            }, {
              name: 'bodyParams',
              data: body
            }]; // 将请求中的数据装载到对应的参数位置中去

            reflectDatas.forEach(reflectData => {
              const methodParams = Reflect.getMetadata(reflectData.name, method);

              for (let i = 0; methodParams && i < methodParams.length; i++) {
                const methodParam = methodParams[i]; // 若未设置name属性，使用变量名作为默认name

                if (methodParam.name === undefined) {
                  methodParam.name = argNames[methodParam.index];
                }

                if (methodParam.defaultVal !== undefined && reflectData.data[methodParam.name] === undefined) {
                  reflectData.data[methodParam.name] = methodParam.defaultVal;
                }

                if (methodParam.required && reflectData.data[methodParam.name] === undefined) {
                  throw new _ValueNotDeliveredError.default();
                }

                if (methodParam.type !== undefined && reflectData.data[methodParam.name].constructor !== methodParam.type) {
                  throw new _TypeNotSatisfyError.default();
                }

                if (methodParam.checkInformation.verification !== undefined) {
                  if (methodParam.checkInformation.type === 'function') {
                    if (!methodParam.checkInformation.verification(reflectData.data[methodParam.name])) {
                      throw new _FormatNotMatchError.default();
                    }
                  } else if (methodParam.checkInformation.type === 'regex') {
                    if (!methodParam.checkInformation.verification.test(reflectData.data[methodParam.name])) {
                      throw new _FormatNotMatchError.default();
                    }
                  } else {
                    throw new TypeError();
                  }
                }

                instanceArgs[methodParam.index] = reflectData.data[methodParam.name];
              }
            });
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
            }];
            indexDatas.forEach(indexData => {
              const index = Reflect.getMetadata(indexData.name, method);

              if (index !== undefined) {
                instanceArgs[index] = indexData.instance;
              }
            });
            let returnBody;

            if (instanceArgs.length === 0) {
              returnBody = await instance[methodName](ctx);
            } else {
              returnBody = await instance[methodName](...instanceArgs);
            }

            if (returnBody !== undefined) {
              ctx.body = returnBody;
            }
          });
        });
        app.use(router.routes());
        app.use(router.allowedMethods());
      }
    }

    oldListen.call(app, ...args);
  };
};

exports.registerApp = registerApp;