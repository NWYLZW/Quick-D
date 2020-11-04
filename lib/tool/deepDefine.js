"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @desc    深度定义 deepDefine.js
 * @author  yijie
 * @date    2020-11-04 10:29
 * @logs[0] 2020-11-04 10:29 yijie 创建了deepDefine.js文件
 */
var _default = (baseObj, properties) => {
  properties.forEach(property => {
    var _baseObj$property$nam;

    baseObj[property.name] = (_baseObj$property$nam = baseObj[property.name]) !== null && _baseObj$property$nam !== void 0 ? _baseObj$property$nam : property.default;
    baseObj = baseObj[property.name];
  });
  return baseObj;
};

exports.default = _default;