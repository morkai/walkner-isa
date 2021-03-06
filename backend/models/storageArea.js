// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

var mongoose = require('mongoose');

module.exports = function setupStorageAreaModel(app, done)
{
  var storageAreaSchema = mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true
    }
  });

  app.db.model('StorageArea', storageAreaSchema);

  return done();
};
