var db = require('./db.js');


function upServer() {
  
}

function clearServer() {
  
}

function listServers() {
  
}

// db.JobModel.create({
//   jobId: '58fd98f60834b020da17e963',
//   port: 5001
// })
// .then(function(doc) {
//   console.log(doc);
// });

// db.JobModel.getByJobId('58fd98f60834b020da17e963', function(error, document) {
//   console.log(document);
// })
// .then(function(document) {
//   console.log('promise');
//   console.log(document);
// });

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

// connection.query('SHOW DATABASES', function (error, results, fields) {
//   if (error) throw error;
//   // connected!
//   console.log(results);
//   console.log(fields);
// });

// connection.query('CREATE DATABASE stroder_vfit_11', function (error, results, fields) {
//   if (error) throw error;
//   // connected!
//   console.log(results);
//   console.log(fields);
// });

// OkPacket {
//   fieldCount: 0,
//     affectedRows: 1,
//     insertId: 0,
//     serverStatus: 2,
//     warningCount: 0,
//     message: '',
//     protocol41: true,
//     changedRows: 0 }
// undefined

connection.end(function(error) {

});

db.mongoose.disconnect();