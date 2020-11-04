/**
 * @desc    用户模型 UserModel.js
 * @author  yijie
 * @date    2020-11-01 16:26
 * @logs[0] 2020-11-01 16:26 yijie 创建了UserModel.js文件
 */
import QMongoose from '~/lib/plugin/QMongoose'
import { QModel } from '~/lib/common/Component'

@QMongoose.QSchema()
class User {
  @QMongoose.QProperty({ type: String })
  name: string
  @QMongoose.QProperty({ type: String })
  nickName: string
  @QMongoose.QProperty({ type: Number })
  age: number
}

@QModel()
export default class UserModel {
  static user = new User()
  async addUser () {
    const newUser = new (UserModel.user)({
      name: 'test',
      nickName: 'testNick',
      age: 123
    })
    newUser.save(err => {
      if (err) {
        throw err
      }
      console.log('add new user success.')
    })
  }
}
