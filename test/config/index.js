/**
 * @desc    配置文件 index.js
 * @author  yijie
 * @date    2020-10-18 17:16
 * @logs[0] 2020-10-18 17:16 yijie 创建了index.js文件
 */
import devConfig from './dev'
import proConfig from './pro'

import './aliases'

const config = {
  production: proConfig,
  development: devConfig
}

export default {
  ...config[process.env.NODE_ENV]
}
