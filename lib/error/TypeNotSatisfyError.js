"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @desc    类型不匹配错误 TypeNotSatisfyError.js
 * @author  yijie
 * @date    2020-10-23 21:44
 * @logs[0] 2020-10-23 21:44 yijie 创建了TypeNotSatisfyError.js文件
 */
class TypeNotSatisfyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TypeNotSatisfyError';
    this.message = message || 'The variable type does not satisfy the specified type';
    this.stack = new Error().stack;
  }

}

exports.default = TypeNotSatisfyError;