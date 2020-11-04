"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PutRequest = exports.DeleteRequest = exports.PostRequest = exports.GetRequest = exports.ReqMethod = exports.Request = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/**
 * @desc    请求 Request.js
 * @author  yijie
 * @date    2020-10-19 17:26
 * @logs[0] 2020-10-19 17:26 yijie 创建了Request.js文件
 */

/**
 * 请求类型枚举
 */
class ReqMethod {}
/**
 * 获取路由注册装饰器
 * @param path        请求路径
 * @param reqMethods  请求类型数组
 * @returns {function({}, String, Object): void}
 */


exports.ReqMethod = ReqMethod;
(0, _defineProperty2.default)(ReqMethod, "GET", 'GET');
(0, _defineProperty2.default)(ReqMethod, "POST", 'POST');
(0, _defineProperty2.default)(ReqMethod, "DELETE", 'DELETE');
(0, _defineProperty2.default)(ReqMethod, "PUT", 'PUT');

const Request = (path = '', reqMethods) => {
  for (let i = 0; i < reqMethods.length; i++) {
    reqMethods[i] = reqMethods[i].toLocaleLowerCase();
  }

  return (target, methodName, method) => {
    const originClass = target.constructor;
    let routes = Reflect.getMetadata('routes', originClass);

    if (routes === undefined) {
      routes = {};
      Reflect.defineMetadata('routes', routes, originClass);
    }

    routes[methodName] = {
      path: path !== undefined ? path : `/${methodName}`,
      reqMethods: reqMethods !== undefined ? reqMethods : ['get'],
      fun: method
    };
  };
};
/**
 * 获取GET请求装饰器
 * @param path  请求路径
 * @returns { MethodDecorator } 特殊的请求装饰器
 */


exports.Request = Request;

const GetRequest = path => {
  return Request(path, [ReqMethod.GET]);
};
/**
 * 获取POST请求装饰器
 * @param path  请求路径
 * @returns { MethodDecorator } 特殊的请求装饰器
 */


exports.GetRequest = GetRequest;

const PostRequest = path => {
  return Request(path, [ReqMethod.POST]);
};
/**
 * 获取DELETE请求装饰器
 * @param path  请求路径
 * @returns { MethodDecorator } 特殊的请求装饰器
 */


exports.PostRequest = PostRequest;

const DeleteRequest = path => {
  return Request(path, [ReqMethod.DELETE]);
};
/**
 * 获取PUT请求装饰器
 * @param path  请求路径
 * @returns { MethodDecorator } 特殊的请求装饰器
 */


exports.DeleteRequest = DeleteRequest;

const PutRequest = path => {
  return Request(path, [ReqMethod.PUT]);
};

exports.PutRequest = PutRequest;