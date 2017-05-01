'strict'

module.exports = {
  databasePrefix: process.env.VFIT_DATABASE_PREFIX || 'strider_vfit_',
  mongo: {
    dbUri: process.env.VFIT_DB_URI || 'mongodb://localhost/test'
  },
  mysql: {
    host: process.env.VFIR_MYSQL_HOST || 'localhost',
    rootUser: process.env.VFIT_MYSQL_ROOT_USER || 'root',
    rootPassword: process.env.VFIT_MYSQL_ROOT_PASSWORD || 'root'
  }
};