"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @desc    格式不匹配错误 FormatNotMatchError.js
 * @author  yijie
 * @date    2020-10-23 21:44
 * @logs[0] 2020-10-23 21:44 yijie 创建了FormatNotMatchError.js文件
 */
class FormatNotMatchError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FormatNotMatchError';
    this.message = message || 'Format does not match';
    this.stack = new Error().stack;
  }

}

exports.default = FormatNotMatchError;