"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Controller = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _deepDefine = _interopRequireDefault(require("../tool/deepDefine"));

/**
 * @desc    路由控制装饰器 Controller.js
 * @author  yijie
 * @date    2020-10-18 17:36
 * @logs[0] 2020-10-18 17:36 yijie 创建了Controller.js文件
 */

/**
 * 根据参数路由控制器装饰器
 * @param path  子路由的基础路径
 * @returns {function(Function): void} 路由控制器装饰器
 * @constructor
 */
const Controller = (path = '') => {
  return originClass => {
    (0, _deepDefine.default)(global, [{
      name: '$Quick-D',
      default: {}
    }, {
      name: 'controllers',
      default: {}
    }, {
      name: originClass.name,
      default: originClass
    }]);
    Reflect.defineMetadata('path', path, originClass);
    Reflect.defineMetadata('router', new _koaRouter.default(), originClass);
  };
};

exports.Controller = Controller;