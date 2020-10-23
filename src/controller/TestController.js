/**
 * @desc    测试路由控制层 TestController.js
 * @author  yijie
 * @date    2020-10-18 17:33
 * @logs[0] 2020-10-18 17:33 yijie 创建了TestController.js文件
 */
import { Controller, GetRequest, PostRequest, Query, BodyParam } from '~/lib/decorator/quick-d'

@Controller('/test')
class TestController {
  @GetRequest('/get-notRequire')
  async test1 (@Query('test1') test1) {
    return `<h1>test1: ${test1}</h1>`
  }
  @GetRequest('/get-require')
  async test2 (@Query('test2', true) test2) {
    return `<h1>test2: ${test2}</h1>`
  }
  @PostRequest('/post-notRequire')
  async test3 (@BodyParam('test') test1) {
    console.log(test1)
    return 'success'
  }
  @PostRequest('/post-require')
  async test4 (@BodyParam('test', true) test1) {
    console.log(test1)
    return 'success'
  }
}
