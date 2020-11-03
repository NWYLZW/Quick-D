/**
 * @desc    用户路由控制层 UserController.js
 * @author  yijie
 * @date    2020-11-01 17:21
 * @logs[0] 2020-11-01 17:21 yijie 创建了UserController.js文件
 */
import { Controller } from '~/lib/common/Controller'
import { GetRequest } from '~/lib/common/Request'

@Controller('/user')
class UserController {
  @GetRequest('/add')
  async addUser (ctx) {
  }
}
