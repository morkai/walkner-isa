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
