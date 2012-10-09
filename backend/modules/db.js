// TODO: Move to config file
var TRIES = 10;
var URI = 'mongodb://localhost/walkner-isa';
var OPTIONS = {};

var mongoose = require('mongoose');

exports.start = function startDbModule(app, done)
{
  app.db = mongoose;

  function tryToConnect(i)
  {
    mongoose.connect(URI, OPTIONS, function(err)
    {
      if (err)
      {
        if (i === TRIES)
        {
          return done(err);
        }

        return setTimeout(function() { tryToConnect(i + 1); }, 250);
      }

      return done();
    });
  }

  tryToConnect(0);
};
