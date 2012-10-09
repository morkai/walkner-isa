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
