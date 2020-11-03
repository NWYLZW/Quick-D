/**
 * @desc    数据库插件 dataBaseServer.js
 * @author  yijie
 * @date    2020-10-29 21:14
 * @logs[0] 2020-10-29 21:14 yijie 创建了dataBaseServer.js文件
 */
import MongoClient from 'mongodb'

const getMongoClient = dataBaseServer => {
  return new Promise((resolve, reject) => {
    const url = 'mongodb://' +
      (dataBaseServer.user     === undefined? '': dataBaseServer.user) +
      (dataBaseServer.password === undefined? '':':' + dataBaseServer.password + '@') +
      (dataBaseServer.host ?? 'localhost') +
      (dataBaseServer.port     === undefined? '':':' + dataBaseServer.port) +
      (dataBaseServer.dbName   === undefined? '':'/' + dataBaseServer.dbName)

    MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
      if (err) {
        reject(err); return
      }
      resolve(db)
    })
  })
}

const getMongooseClient = dataBaseServer => {
  return new Promise((resolve, reject) => {
    const url = 'mongodb://' +
      (dataBaseServer.user     === undefined? '': dataBaseServer.user) +
      (dataBaseServer.password === undefined? '':':' + dataBaseServer.password + '@') +
      (dataBaseServer.host ?? 'localhost') +
      (dataBaseServer.port     === undefined? '':':' + dataBaseServer.port) +
      (dataBaseServer.dbName   === undefined? '':'/' + dataBaseServer.dbName)

    const mongoose = new (require('mongoose').Mongoose)()
    try {
      resolve(
        mongoose.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          ...dataBaseServer.option
        })
      )
    } catch (e) {
      reject(e)
    }
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
        dbClients[dataBaseServerName] = {
          type: 'mongodb',
          db: await getMongoClient(dataBaseServer)
        }
        break
      case 'mongoose':
        dbClients[dataBaseServerName] = {
          type: 'mongoose',
          db: await getMongooseClient(dataBaseServer)
        }
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
