'use strict'

module.exports = {
  config: {
    vfitServer: {
      environment: { type: String, default: 'Hi from `environment`' },
      prepare: { type: String, default: 'Hi from `prepare`' },
      test: { type: String, default: 'Hi from `test`' },
      deploy: { type: String, default: 'Hi from `deploy`' },
      cleanup: { type: String, default: 'Hi from `cleanup`' }
    }
  },
  routes: function (app, context) {},
  globalRoutes: function (app, context) {},
  listen: function (emitter, context) {}
};
