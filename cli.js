const cli = require('cli');

cli.parse(null, ['test', 'command', 'sync']);
console.log(cli.command);

if ('test_create_database' == cli.command) {

}
else if('test_list_databases' == cli.command) {

}
