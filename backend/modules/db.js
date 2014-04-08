// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

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
