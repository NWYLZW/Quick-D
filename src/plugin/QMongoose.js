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
        __$QInitModel () {
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
            throw new MongooseError('Cannot find the specified connection')
          }

          selDataBaseServer = selDataBaseServer.db
          const Schema = selDataBaseServer.Schema

          let properties = Reflect.getMetadata('properties', originClass) ?? {}
          this.$QModel = selDataBaseServer.model(
            schemaName ?? originClass.name,
            new Schema(properties)
          )
        }
        constructor () {
          super()
          this.__$QInitModel()
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
