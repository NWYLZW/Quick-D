/**
 * @desc    用户路由控制层 UserController.js
 * @author  yijie
 * @date    2020-11-01 17:21
 * @logs[0] 2020-11-01 17:21 yijie 创建了UserController.js文件
 */
import { Controller } from '~/lib/common/Controller'
import { GetRequest } from '~/lib/common/Request'
import { AutoWired } from '~/lib/common/Component'
import UserModel from '@/model/UserModel'

@Controller('/user')
class UserController {
  @AutoWired()
  static userModel: UserModel

  @GetRequest('/add')
  async addUser (ctx) {
  }
}
