// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

var START_TIME = Date.now();

// TODO: Move to config file
var MODULE_START_TIMEOUT = 2000;

var step = require('step');
var express = require('express');

var app = express();
app.startTime = START_TIME;

require('./utils/app').extend(app);
require('./utils/logs').extend(console);

step(
  function startModulesStep()
  {
    console.info('Starting...');

    var startModules = [];

    require('./modules').forEach(function(moduleName)
    {
      var module;

      try
      {
        module = require('./modules/' + moduleName);
      }
      catch (err)
      {
        console.error("%s module failed to load: %s", moduleName, app.stackOrMessage(err.stack));
        process.exit(1);
      }

      if (typeof module !== 'object' || module === null || typeof module.start !== 'function')
      {
        console.error("%s is not a valid module: missing the start() function", moduleName);
        process.exit(1);
      }

      startModules.push(function(err)
      {
        var next = this;

        if (err)
        {
          return next(err);
        }

        startModules.currentModuleName = moduleName;

        console.info("%s module starting...", moduleName);

        var startTimer = app.timeout(MODULE_START_TIMEOUT, function()
        {
          console.error("%s module failed to start in the allowed time of %ds", moduleName, MODULE_START_TIMEOUT / 1000);
          process.exit(1);
        });

        module.start(app, function(err)
        {
          clearTimeout(startTimer);

          if (err)
          {
            if (!(err instanceof Error))
            {
              err = new Error(err.toString());
              err.stack = null;
            }

            err.moduleName = moduleName;
          }

          next(err);
        });
      });
    });

    var next = this;

    startModules.push(function(err)
    {
      if (err && !err.moduleName)
      {
        err.moduleName = startModules.currentModuleName;
      }

      next(err);
    });

    step.apply(null, startModules);
  },
  function handleStartupResult(err)
  {
    if (err)
    {
      console.error("%s module failed to start: %s", err.moduleName, app.stackOrMessage(err));
      process.exit(1);
    }

    return true;
  },
  function finishStartupStep()
  {
    console.info("Started the %s environment in %d ms", app.settings.env, Date.now() - app.startTime);
  }
);
