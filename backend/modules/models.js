// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

exports.start = function startModelsModule(app, done)
{
  var modelsDir = app.path('models');
  var modelsList = require(app.path('models', 'index'));

  app.loadFiles(modelsDir, modelsList, done);
};
