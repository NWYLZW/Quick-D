"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @desc    值未传递错误 ValueNotDeliveredError.js
 * @author  yijie
 * @date    2020-10-21 10:18
 * @logs[0] 2020-10-21 10:18 yijie 创建了ValueNotDeliveredError.js文件
 */
class ValueNotDeliveredError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueNotDeliveredError';
    this.message = message || 'Value is required,but not delivered';
    this.stack = new Error().stack;
  }

}

exports.default = ValueNotDeliveredError;