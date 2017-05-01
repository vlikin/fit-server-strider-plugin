'use strict';

/* Functions for demonstration purposes only */
function checkSomething(context, callback){
	//Do something here, then call back
	callback(true);
};

function doThings(callback){
	callback(null);
};

console.log('dd1');

module.exports = {
	// Initialize the plugin for a job
	//   config: the config for this job, made by extending the DB config
	//           with any flat-file config
	//   job:    see strider-runner-core for a description of that object
	//   context: currently only defines "dataDir"
	//   cb(err, initializedPlugin)
  init: function (config, job, context, cb) {
    var ret = {
      // any extra env variables. Will be available during all phases
      env: {},
      // Listen for events on the internal job emitter.
      //   Look at strider-runner-core for an
      //   enumeration of the events. Emit plugin.[pluginid].myevent to
      //   communicate things up to the browser or to the webapp.
      listen: function (emitter, context) {
        emitter.on('job.status.phase.done', function (id, data) {
          var phase = data.phase;
          console.log('the ' + phase + ' phase has completed');
          return true;
        });
      },
      // For each phase that you want to deal with, provide either a
      // shell command [string] or [Object] (as demo'd below)
      // or a fn(context, done(err, didrun))

      //string style
      environment: 'echo "' + config.environment + '"',
        //object style
        prepare: {
      command: 'echo',
        args: ['"' + config.prepare + '"']
    },
      //function style (calling done is a MUST)
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
	// this is only used if there is _no_ plugin configuration for a
	// project. See gumshoe for documentation on detection rules.
	autodetect: {
		filename: 'package.json',
		exists: true
	}
};
