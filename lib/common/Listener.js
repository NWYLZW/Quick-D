"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventHandler = exports.EventListener = void 0;

/**
 * @desc    事件监听器 Listener.js
 * @author  yijie
 * @date    2020-10-26 20:13
 * @logs[0] 2020-10-26 20:13 yijie 创建了Listener.js文件
 */

/**
 * 事件处理器
 * @returns {function(Object, string, Function)}
 * @constructor
 */
const EventHandler = () => {
  return (target, methodName, method) => {};
};

exports.EventHandler = EventHandler;

class EventListener {}

exports.EventListener = EventListener;