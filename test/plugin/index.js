import { registerDBServers } from '~/lib/index'

import config from '@/config/index'

import getDataBaseServers from '@/plugin/dataBaseServer'

const registerPlugins = async () => {
  registerDBServers(
    await getDataBaseServers(config)
  )
  require('@/model/UserModel')
}

export {
  registerPlugins
}
