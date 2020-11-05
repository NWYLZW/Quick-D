"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongooseError = _interopRequireDefault(require("mongoose/lib/error/mongooseError"));

/**
 * @desc    Quick-D的Mongoose插件 QMongoose.js
 * @author  yijie
 * @date    2020-11-01 21:33
 * @logs[0] 2020-11-01 21:33 yijie 创建了QMongoose.js文件
 */
var _default = {
  QSchema: (schemaName, dbName) => {
    return originClass => {
      (async _ => {
        var _Reflect$getMetadata;

        let count = 10;

        const getSelDataBaseServer = () => {
          return new Promise((resolve, reject) => {
            setTimeout(_ => {
              var _dataBaseServers, _global$$QuickD;

              count -= 1;

              if (count === 0) {
                reject(new _mongooseError.default('Cannot find the specified connection'));
              }

              const dataBaseServers = (_dataBaseServers = ((_global$$QuickD = global['$Quick-D']) !== null && _global$$QuickD !== void 0 ? _global$$QuickD : {})['dataBaseServers']) !== null && _dataBaseServers !== void 0 ? _dataBaseServers : {};
              let selDataBaseServer = void 0;

              for (const dataBaseServerName in dataBaseServers) {
                const dataBaseServer = dataBaseServers[dataBaseServerName];
                if (dataBaseServer.type !== 'mongoose') continue;

                if (dbName === void 0 || dbName === dataBaseServerName) {
                  selDataBaseServer = dataBaseServer;
                  break;
                }
              }

              if (selDataBaseServer === void 0) {
                getSelDataBaseServer().then(resolve).catch(reject);
                return;
              }

              resolve(selDataBaseServer);
            }, 500);
          });
        };

        const selDataBaseServer = (await getSelDataBaseServer()).db;
        const Schema = selDataBaseServer.Schema;
        const properties = (_Reflect$getMetadata = Reflect.getMetadata('properties', originClass)) !== null && _Reflect$getMetadata !== void 0 ? _Reflect$getMetadata : {};
        const schema = new Schema(properties);
        originClass.$QModel = selDataBaseServer.model(schemaName !== null && schemaName !== void 0 ? schemaName : originClass.name, schema);
      })().then(_ => {});
    };
  },
  QProperty: (value, alias) => {
    return (target, propertyKey) => {
      let properties = Reflect.getMetadata('properties', target.constructor);

      if (properties === undefined) {
        properties = {};
      }

      properties[alias !== null && alias !== void 0 ? alias : propertyKey] = value;
      Reflect.defineMetadata('properties', properties, target.constructor);
    };
  }
};
exports.default = _default;