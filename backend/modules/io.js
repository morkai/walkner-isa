// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

var Server = require('http').Server;
var io = require('socket.io');

exports.start = function startIoModule(app, done)
{
  if (!app.httpServer || !(app.httpServer instanceof Server))
  {
    return done("io module requires the httpServer module");
  }

  app.io = io.listen(app.httpServer, {
    log: false
  });

  app.configure('production', function()
  {
    app.io.enable('browser client minification');
    app.io.enable('browser client etag');
    app.io.enable('browser client gzip');
  });

  return done();
};
