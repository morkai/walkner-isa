

exports.start = function startRoutingModule(app, done)
{
  app.loadDir(app.path('routes'), done);
};
