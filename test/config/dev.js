export default {
  server: {
    host: '127.0.0.1',
    port: 10101
  },
  dataBaseServers: {
    'mongodb-server-01': {
      type: 'mongodb',
      host: '127.0.0.1',
      port: 27017,
      dbName: 'dev-server-1'
    },
    'mongoose-server-01': {
      type: 'mongoose',
      host: '127.0.0.1',
      port: 27017,
      dbName: 'dev-server-1'
    }
  }
}
