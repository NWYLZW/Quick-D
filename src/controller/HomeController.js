/**
 * @desc    主页路由控制层 HomeController.js
 * @author  yijie
 * @date    2020-10-18 17:33
 * @logs[0] 2020-10-18 17:33 yijie 创建了HomeController.js文件
 */
import { Controller, GetRequest, Query } from "~/lib/decorator/quick-d";

@Controller()
class HomeController {
  text = `
      <h1>Hello world test</h1>
  `
  @GetRequest('/hello')
  async hello (ctx, @Query x) {
    console.log(x)
    return `${this.text}${x.test}`
  }
}
