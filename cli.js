'use strict'

const cli = require('cli');
cli.parse(null, ['test', 'databases', 'sync']);

// Lists MySQL databases.
if ('databases' == cli.command) {
  var db = require('./lib/db');
  var Table = require('cli-table2');
  var table = new Table({
    head: [ 'MySQL databases' ]
  });
  var dispose = function() {
    db.dispose();
  }
  db.mysqlConnection.query('SHOW DATABASES', function (error, results, fields) {
    var rows = [];
    results.forEach(function(row) {
      table.push([row.Database])
    });
    console.log(table.toString());

    // Disposes resources.
    dispose();
  });
}

// Another command.
else if('test' == cli.command) {
  console.log('test');
}
