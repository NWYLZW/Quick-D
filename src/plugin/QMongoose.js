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
      class newClass extends originClass {
        async __$QInitModel () {
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

          let properties = Reflect.getMetadata('properties', originClass) ?? {}
          const model = selDataBaseServer.model(
            schemaName ?? originClass.name,
            new Schema(properties)
          )
          for (const modelKey in model) {
            this[modelKey] = model[modelKey]
          }
        }
        constructor () {
          super()
          this.__$QInitModel()
            .then(_ => {})
        }
      }
      return newClass
    }
  },
  QProperty: (value: Object, alias: string): PropertyDecorator => {
    return (target: Object, propertyKey: String | Symbol) => {
      let properties = Reflect.getMetadata('properties', target)
      if (properties === undefined) {
        properties = {}
      }
      properties[alias ?? propertyKey] = value
      Reflect.defineMetadata('properties', properties, target)
    }
  }
}
