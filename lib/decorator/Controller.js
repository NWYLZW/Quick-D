/**
 * @desc    路由控制装饰器 Controller.js
 * @author  yijie
 * @date    2020-10-18 17:36
 * @logs[0] 2020-10-18 17:36 yijie 创建了Controller.js文件
 */
import Router from 'koa-router'
let APP = undefined

const registerApp = app => {
  APP = app
}

const Controller = originClass => {
  if (global['$Quick-D'] === undefined) {
    global['$Quick-D'] = {}
  }
  if (global['$Quick-D'].routers === undefined) {
    global['$Quick-D'].routers = {}
  }
  console.log(originClass)
}
const Request = (path: String, method: String[]) => {
  return (target: Object, methodName: string, method: Function) => {
    APP.use(
      global['$Quick-D']
        .routers[`${target}`]
        .routes()
    )
  }
}
const GetRequest = (path: String) => {
  return Request(path, ['GET'])
}
const PostRequest = (path: String) => {
  return Request(path, ['POST'])
}

export {
  registerApp,
  Controller,
  Request, GetRequest, PostRequest
}
