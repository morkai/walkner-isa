// TODO: Move to config file
var PORT = 3001;

var util = require('util');
var http = require('http');

exports.start = function startHttpServerModule(app, done)
{
  function onError(err)
  {
    if (err.code === 'EADDRINUSE')
    {
      return done(util.format("port %d already in use?", PORT));
    }
  }

  app.httpServer = http.createServer(app);
  app.httpServer.once('error', onError);
  app.httpServer.listen(PORT, function()
  {
    app.httpServer.removeListener('error', onError);

    return done();
  });
};
