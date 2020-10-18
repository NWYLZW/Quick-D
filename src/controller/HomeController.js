/**
 * @desc    主页路由控制层 HomeController.js
 * @author  yijie
 * @date    2020-10-18 17:33
 * @logs[0] 2020-10-18 17:33 yijie 创建了HomeController.js文件
 */
import { Controller, GetRequest } from '../../lib/decorator/Controller'

@Controller
export default class HomeController {
  @GetRequest('/home/test1')
  test1 () {
    return {
      code: 200,
      message: 'yes'
    }
  }
}
