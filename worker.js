'use strict';

var lib = require('./lib');

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
      prepare: function (context, done) {
        context.comment('Deletes unused resources.');
        return lib.deleteUnusedJobResources()
          .then(function() {
            context.comment('Resources were cleared.');
            done(null, true);
          })
          .catch(function(err) {
            context.out(err, 'stderror');
            done(err, false);
          });
      },
      test: function (context, done) {
      	context.comment('The application state is initiating...');
      	lib.upProjectState(context, done);
			},
      deploy: 'echo "' + config.deploy + '"',
      cleanup: function (context, done) {
        //lib.dispose();
        done(null, true);
      }
    };
		return cb(null, ret);
	},
	autodetect: {
		filename: 'package.json',
		exists: true
	}
};
