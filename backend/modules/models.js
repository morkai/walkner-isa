

exports.start = function startModelsModule(app, done)
{
  var modelsDir = app.path('models');
  var modelsList = require(app.path('models', 'index'));

  app.loadFiles(modelsDir, modelsList, done);
};
