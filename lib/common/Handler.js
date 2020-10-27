"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorsHandler = exports.ErrorListener = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/**
 * @desc    处理器 Handler.js
 * @author  yijie
 * @date    2020-10-25 20:34
 * @logs[0] 2020-10-25 20:34 yijie 创建了Handler.js文件
 */

/**
 * 异常监听器
 */
class ErrorListener {
  constructor() {
    (0, _defineProperty2.default)(this, "isLogStack", false);
  }

}
/**
 * 异常处理器
 * @param errors  {Array<Error>}  处理的异常列表
 * @param weight  {Number}        处理权重
 */


exports.ErrorListener = ErrorListener;

const ErrorsHandler = (errors, weight) => {
  var _errors, _weight;

  errors = (_errors = errors) !== null && _errors !== void 0 ? _errors : [];
  weight = (_weight = weight) !== null && _weight !== void 0 ? _weight : 0;
  return (target, methodName, method) => {
    const properties = [{
      name: '$Quick-D',
      default: {}
    }, {
      name: 'errorsHandlers',
      default: {}
    }, {
      name: target.constructor.name,
      default: target.constructor
    }];
    let baseObj = global;
    properties.forEach(property => {
      var _baseObj$property$nam;

      baseObj[property.name] = (_baseObj$property$nam = baseObj[property.name]) !== null && _baseObj$property$nam !== void 0 ? _baseObj$property$nam : property.default;
      baseObj = baseObj[property.name];
    });
    let errorsHandlers = Reflect.getMetadata('errorsHandlers', ErrorListener);

    if (errorsHandlers === undefined) {
      errorsHandlers = [];
      Reflect.defineMetadata('errorsHandlers', errorsHandlers, ErrorListener);
    }

    errorsHandlers.push({
      target,
      methodName,
      errors,
      weight
    });
    Reflect.defineMetadata('errorsHandlers', errorsHandlers, ErrorListener);
  };
};

exports.ErrorsHandler = ErrorsHandler;