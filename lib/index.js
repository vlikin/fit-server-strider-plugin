var db = require('./db.js');
var shell = require('shelljs');
var config = require('../config');

/**
 * Ups the project.
 *
 * @param context
 */
function upProjectState(context, done) {
  // Creates MySQL database.
  var databaseName = config.databasePrefix + Date.now();
  db.mysqlConnection.query('CREATE DATABASE ' + databaseName, function (error, results, fields) {
    if (error) throw error;
    context.out('The database has been created.' + '\n');

    // Inits applications.
    var process = shell.exec('npm install --prefix ' + context.dataDir + '/server', { silent: true });
    context.out(process.stdout);
    context.out(process.stderror, 'stderror');
    context.out('The dependencies have been installed.' + '\n');

    // Builds and test the application.
    var process = shell.exec('npm test --prefix ' + context.dataDir + '/server', { silent: true });
    context.out(process.stdout);
    context.out(process.stderror, 'stderror');
    context.out('The application has been tested.' + '\n');

    var statePort = 6003;
    var environmentString = ' ' +
      'MODE=dev ' +
      'DATABASE_NAME=' + databaseName + ' ' +
      'DATABASE_USER=' + config.mysql.rootUser + ' ' +
      'DATABASE_PASSWORD=' + config.mysql.rootPassword + ' ' +
      'PORT=' + statePort + ' ';

    // Initiates the data.
    var process = shell.exec('npm run sync --prefix ' + context.dataDir + '/server', { silent: true });
    context.out(process.stdout);
    context.out(process.stderror, 'stderror');
    context.out('The dependencies have been installed.' + '\n');

    context.out(environmentString + '\n');
    // Runs server.
    var stateProcess = shell.exec(environmentString + ' npm start --prefix ' + context.dataDir + '/server',
      { async: true }
    );
    context.out('The project has been started at the port - ' + statePort + '\n');

    // Registers job's application.
    db.JobModel.create({
      jobId: context.job._id,
      port: statePort,
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
  upProjectState: upProjectState,
  dispose: dispose
};