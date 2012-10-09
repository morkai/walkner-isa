// TODO: Move to config file
var COOKIE_SECRET = '1ee7isa';

var express = require('express');
var MongoStore = require('../utils/MongoStore')(express.session.Store);

exports.start = function startExpressModule(app, done)
{
  app.set('views', app.path('templates'));
  app.set('view engine', 'jade');

  app.use(express.cookieParser(COOKIE_SECRET));
  app.use(express.session({
    store: new MongoStore(app.db.connection.db)
  }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require(app.path('middleware/menu'))(app));
  app.use(app.router);

  app.configure('development', function()
  {
    app.use(express.static(app.path('../frontend')));
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
  });

  app.configure('production', function()
  {
    app.use(express.static(app.path('../frontend-build')));
    app.use(express.errorHandler());
  });

  return done();
};
