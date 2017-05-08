'use strict'

const cli = require('cli');
cli.parse(null, ['test', 'databases', 'sync', 'set-github-status', 'post-github-status']);

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
else if('set-github-status' == cli.command) {
  // Sends commit status to GitHub.
  // The problem was in permissions.
  var GitHubApi = require("github");

  var github = new GitHubApi({
    debug: true
  });

  github.authenticate({
    type: "oauth",
    token: 'XXX',
  });

  github.repos.createStatus({
    owner: "vlikin",
    repo: "viktor-fitness",
    sha: "f63fc71dd1cce705d83605cfed0e74e188c3d3f4",
    state: "success",
    target_url: 'https://example.com/build/status1111',
    description: 'The build succeeded!1111',
    context: 'continuous-integration/jenkins111'
  })
    .then(function(res) {
      console.log(res);
    });
}
else if('post-github-status' == cli.command) {
  var util = require('util');
  var https = require('https');
  // Sends commit status to GitHub.
  var CLIENT_ID = 'd288295de00f1bf0d8ab';
  var CLIENT_SECRET = 'e5b6b0bb55cbf163f741fdd2cc2e88a66891becc';

  const postData = JSON.stringify({
    state: 'success',
    target_url: 'https://example.com/build/status',
    description: 'The build succeeded!',
    context: 'continuous-integration/jenkins'
  });


  var owner = 'vlikin';
  var repo = 'viktor-fitness';
  var sha = 'e6cad036d4389358d9585af7a1c367b9e6032683';
  var path = util.format('/repos/%s/%s/statuses/%s', owner, repo, sha);
  console.log('path=', path);
  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: path,
    method: 'POST',
    headers: {
      'Authorization': util.format('token %s', 'XXXXXX'),
      'User-Agent': 'Strider-Vfit-plugin-github',
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}
