/**
 * @desc    项目启动文件 app.js
 * @author  yijie
 * @date    2020-10-18 15:40
 * @logs[0] 2020-10-18 15:40 yijie 创建了app.js文件
 */
// 控制台彩色字体
import 'colors'
// 模块导入重命名
import 'module-alias/register'
import Koa from 'koa'

import { registerApp } from '~/lib/decorator/quick-d'
import config from '@/config'

global.MAIN_APP = new Koa()

registerApp(MAIN_APP)

import '@/controller/HomeController'

MAIN_APP.listen(config.server.port, config.server.host, _ => {
  console.log(
    require('figlet').textSync('Quick-D').blue
  )
  console.log('Server is running in '.red + `http://${config.server.host}:${config.server.port}`.green)
})
