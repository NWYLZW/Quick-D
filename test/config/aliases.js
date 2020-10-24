/**
 * @desc    导入重命名配置 aliases.js
 * @author  yijie
 * @date    2020-10-20 15:00
 * @logs[0] 2020-10-20 15:00 yijie 创建了aliases.js文件
 */
import path from 'path'
import moduleAlias from 'module-alias'

let aliasesEnvs = {
  default: {
    '~': path.join(__dirname, '../../'),
    '@': path.join(__dirname, '../')
  },
  development: {
    '~/lib': path.join(__dirname, '../../src')
  }
}

for (let alias in aliasesEnvs.default) {
  moduleAlias.addAlias(alias, aliasesEnvs.default[alias])
}

if (
  process.env.NODE_ENV !== undefined &&
  aliasesEnvs[process.env.NODE_ENV] !== undefined
) {
  for (let alias in aliasesEnvs[process.env.NODE_ENV]) {
    moduleAlias.addAlias(alias, aliasesEnvs[process.env.NODE_ENV][alias])
  }
}

moduleAlias()
