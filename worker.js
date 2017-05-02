'use strict';

module.exports = {
  init: function (config, job, context, cb) {
    var ret = {
      env: {},
      listen: function (emitter, context) {
        emitter.on('job.status.phase.done', function (id, data) {
          var phase = data.phase;
          console.log('the ' + phase + ' phase has completed');
          return true;
        });
      },
      environment: 'echo "' + config.environment + '"',
      prepare: {
        command: 'echo',
        args: ['"' + config.prepare + '"']
      },
      test: function (context, done) {
      	context.comment('The application state is initiating...');
      	var lib = require('./lib');
      	lib.upProjectState(context, done);
			},
      deploy: 'echo "' + config.deploy + '"',
      cleanup: 'echo "' + config.cleanup + '"'
    };
		return cb(null, ret);
	},
	autodetect: {
		filename: 'package.json',
		exists: true
	}
};
