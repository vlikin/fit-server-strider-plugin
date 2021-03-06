'use strict'

var db = require('./db.js');
var shell = require('shelljs');
var config = require('../config');
var fs = require('fs');

/**
 * Propose next state number.
 *
 * This number is used to distinguish databases and servers by ports.
 */
function getStateNumber(startPort, finishPort) {
  if (!startPort) {
    startPort = 7100;
  }
  if (!finishPort) {
    finishPort = 7200;
  }

  return db.JobModel.find().exec()
    .then(function(docs) {
      var ports = docs.map(function(doc) {
        return doc.port;
      });
      if (ports.length == 0) {
        nextPort = startPort;
      }
      else {
        var lastUsedPort = ports.sort().pop();
        var nextPort = lastUsedPort + 1;
        if (nextPort > finishPort) {
          nextPort = startPort;
        }
      }

      return nextPort;
    });
}

/**
 * Deletes unused job resources.
 *
 * - Kills servers.
 * - Removes databases.
 */
function deleteUnusedJobResources() {
  return db.JobModel.find().exec()
    .then(function(jobs) {
      jobs.forEach(function(job) {
        if (!fs.existsSync(job.sourceDirectory)) {
          // Kills the server.
          shell.exec('kill ' + job.pid, { async:true });

          // Drops the database.
          var databaseName = config.databasePrefix + job.port;
          db.mysqlConnection.query('DROP DATABASE ' + databaseName, function (error, results, fields) {});

          // Removes the job entry.
          job.remove();
          console.log(job.sourceDirectory);
        }
      })
    });
}

/**
 * Drops database by pattern.
 *
 * @param pattern
 */
function dropDatabasesByPattern(pattern) {
  db.mysqlConnection.query('SHOW DATABASES', function (error, results, fields) {
    results.forEach(function(row) {
      if (row.Database.indexOf(pattern) === 0) {
        db.mysqlConnection.query('Drop DATABASE ' + row.Database);
      }
    });
  });
}

/**
 * Ups the project.
 *
 * @param context
 */
async function upProjectState(context, done) {
  // Creates MySQL database.
  var stateNumber = await getStateNumber();

  var databaseName = config.databasePrefix + stateNumber;
  db.mysqlConnection.query('CREATE DATABASE ' + databaseName, function (error, results, fields) {
    if (error) throw error;
    context.out('The database has been created.' + '\n');

    // Inits applications.
    // var process = shell.exec('npm install --prefix ' + context.dataDir + '/server', { silent: true });
    // context.out(process.stdout);
    // context.out(process.stderror, 'stderror');
    // context.out('The dependencies have been installed.' + '\n');

    // Builds and test the application.
    var process = shell.exec('npm test --prefix ' + context.dataDir + '/server', { silent: true });
    context.out(process.stdout);
    context.out(process.stderror, 'stderror');
    context.out('The application has been tested.' + '\n');

    var environmentString = ' ' +
      'MODE=dev ' +
      'DATABASE_NAME=' + databaseName + ' ' +
      'DATABASE_USER=' + config.mysql.rootUser + ' ' +
      'DATABASE_PASSWORD=' + config.mysql.rootPassword + ' ' +
      'PORT=' + stateNumber + ' ';

    // Initiates the data.
    var process = shell.exec(environmentString + 'npm run cli sync --prefix ' + context.dataDir + '/server', { silent: true });
    context.out(process.stdout);
    context.out(process.stderror, 'stderror');
    context.out('The dependencies have been installed.' + '\n');

    context.out(environmentString + '\n');
    // Runs server.
    var stateProcess = shell.exec(environmentString + ' npm start --prefix ' + context.dataDir + '/server',
      { async: true }
    );
    context.out('The project has been started at the port - ' + stateNumber + '\n');

    // Registers job's application.
    db.JobModel.create({
      jobId: context.job._id,
      port: stateNumber,
      pid: stateProcess.pid,
      sourceDirectory: context.dataDir
    })
      .then(function (doc) {
        context.out('The configuration is registered with id - ' + doc._id + '\n');
        done(null, true);
      });
  });
}

/**
 * Disposes resources.
 */
function dispose() {
  db.dispose();
}

module.exports = {
  deleteUnusedJobResources: deleteUnusedJobResources,
  getStateNumber: getStateNumber,
  upProjectState: upProjectState,
  dispose: dispose
};