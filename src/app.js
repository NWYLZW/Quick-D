/**
 * @desc    项目启动文件 app.js
 * @author  yijie
 * @date    2020-10-18 15:40
 * @logs[0] 2020-10-18 15:40 yijie 创建了app.js文件
 */
import 'colors'
import Koa from 'koa'
import { registerApp } from '~/lib/decorator/Controller'
const config = require('./config').default

global.MAIN_APP = new Koa()

registerApp(MAIN_APP)

MAIN_APP.listen(config.server.port, config.server.host, _ => {
  console.log(
    require('figlet').textSync('Quick-D').blue
  )
  console.log('Server is running in '.red + `http://${config.server.host}:${config.server.port}`.green)
})
