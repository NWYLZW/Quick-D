import { registerDBServers } from '~/lib/index'

import config from '@/config/index'

import getDataBaseServers from '@/plugin/dataBaseServer'

const registerPlugins = async () => {
  registerDBServers(
    await getDataBaseServers(config)
  )
  console.log('global[\'$Quick-D\'][\'dataBaseServers\']: ', global['$Quick-D']['dataBaseServers'])
}

export {
  registerPlugins
}
