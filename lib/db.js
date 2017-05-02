'use strict'

var config = require('../config');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
mongoose.Promise = bluebird;
mongoose.connect(config.mongo.dbUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var jobSchema = mongoose.Schema(
  {
    jobId: String,
    port: Number,
    pid: Number,
    sourceDirectory: String,
    databaseName: String
  },
  {
    timestamps: true
  }
);

class JobClass {

  get fullName() {
  }

  set fullName(value) {
  }

  static getByJobId(jobId, callback) {
    return this.findOne({ jobId: jobId }, callback);
  }

  static getJobByLastUsedPort(jobId, callback) {
    return this.findOne({ $query: {}, $order: { port: -1 } }, callback);
  }

}

jobSchema.loadClass(JobClass);
var JobModel = mongoose.model('Job', jobSchema);

// MySQL for project instances.
var mysql      = require('mysql');
var mysqlConnection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.rootUser,
  password: config.mysql.rootPassword
});

mysqlConnection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + mysqlConnection.threadId);
});

function dispose() {
  mongoose.disconnect();
  mysqlConnection.end();
}

module.exports = {
  mongoose: mongoose,
  jobSchema: jobSchema,
  JobModel: JobModel,
  mysqlConnection: mysqlConnection,
  dispose: dispose
}
