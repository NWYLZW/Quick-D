/**
 * @desc    数据库插件 dataBaseServer.js
 * @author  yijie
 * @date    2020-10-29 21:14
 * @logs[0] 2020-10-29 21:14 yijie 创建了dataBaseServer.js文件
 */
import MongoClient from 'mongodb'

const getMongoClient = dataBaseServer => {
  return new Promise((resolve, reject) => {
    const url =
      `${dataBaseServer.type}://${dataBaseServer.host}:${dataBaseServer.port}/${dataBaseServer.dbName}`

    MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
      if (err) {
        reject(err); return
      }
      resolve(db)
    })
  })
}

export default async (config) => {
  const
    dbClients = {},
    dataBaseServers = config?.dataBaseServers ?? {}

  for (const dataBaseServerName in dataBaseServers) {
    const dataBaseServer = dataBaseServers[dataBaseServerName]

    switch (dataBaseServer.type) {
      case 'mongodb':
        const url =
          `${dataBaseServer.type}://${dataBaseServer.host}:${dataBaseServer.port}/${dataBaseServer.dbName}`

        dbClients[dataBaseServerName] = ({
          type: 'mongodb',
          db: await getMongoClient(dataBaseServer)
        })
        break
      case 'mysql':
        console.warn('Does not support mysql database temporarily')
        break
      default:
        console.warn('This database type is not currently supported')
        break
    }
  }
  return dbClients
}
