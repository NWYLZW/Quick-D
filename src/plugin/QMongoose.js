/**
 * @desc    Quick-D的Mongoose插件 QMongoose.js
 * @author  yijie
 * @date    2020-11-01 21:33
 * @logs[0] 2020-11-01 21:33 yijie 创建了QMongoose.js文件
 */
import MongooseError from 'mongoose/lib/error/mongooseError'

export default {
  QSchema: (schemaName: string, dbName: string): ClassDecorator => {
    return (originClass: Function) => {
      (async _ => {
        let count = 10
        const getSelDataBaseServer = () => {
          return new Promise((resolve, reject) => {
            setTimeout(_ => {
              count-=1
              if (count === 0) {
                reject(new MongooseError('Cannot find the specified connection'))
              }

              const dataBaseServers =
                ((global
                  ['$Quick-D'] ?? {})
                  ['dataBaseServers'] ?? {})
              let selDataBaseServer = void 0
              for (const dataBaseServerName in dataBaseServers) {
                const dataBaseServer = dataBaseServers[dataBaseServerName]
                if (dataBaseServer.type !== 'mongoose') continue
                if (
                  dbName === void 0
                  || dbName === dataBaseServerName
                ) {
                  selDataBaseServer = dataBaseServer
                  break
                }
              }
              if (selDataBaseServer === void 0) {
                getSelDataBaseServer()
                  .then(resolve)
                  .catch(reject)
                return
              }
              resolve(selDataBaseServer)
            }, 500)
          })
        }

        const selDataBaseServer = (await getSelDataBaseServer()).db
        const Schema = selDataBaseServer.Schema

        const properties = Reflect.getMetadata('properties', originClass) ?? {}
        const schema = new Schema(properties)

        originClass.$QModel = selDataBaseServer.model(
          schemaName ?? originClass.name,
          schema
        )
      })().then(_ => {
      })
    }
  },
  QProperty: (value: Object, alias: string): PropertyDecorator => {
    return (target: Object, propertyKey: String | Symbol) => {
      let properties = Reflect.getMetadata('properties', target.constructor)
      if (properties === undefined) {
        properties = {}
      }
      properties[alias ?? propertyKey] = value
      Reflect.defineMetadata('properties', properties, target.constructor)
    }
  }
}
