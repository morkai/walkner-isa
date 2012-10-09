var mongoose = require('mongoose');

module.exports = function setupForkliftModel(app, done)
{
  var forkliftSchema = mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true
    }
  });

  app.db.model('Forklift', forkliftSchema);

  return done();
};
