'strict'

module.exports = {
  mongo: {
    DB_URI: process.env.VFIT_DB_URI || 'mongodb://localhost/test';
  },
  mysql: {
    HOST: process.env.VFIR_MYSQL_HOST || 'localhost',
    ROOT_USER: process.env.MYSQL_ROOT_USER || 'root',
    ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD || 'root'
  }
};