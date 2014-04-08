// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

module.exports = function(app, done)
{
  app.get('/', showDashboard.bind(null, app));

  app.post('/control', control.bind(null, app));

  return done();
};

function showDashboard(app, req, res, next)
{
  var workingStorageAreas = app.dashboard.getWorkingStorageAreas();

  res.format({
    html: function()
    {
      res.render('app/dashboard', {
        workingStorageAreas: workingStorageAreas
      });
    },
    json: function()
    {
      res.send(workingStorageAreas);
    }
  });
}

function control(app, req, res, next)
{
  switch (req.param('action'))
  {
    case 'loadedStorageArea':
      return loadedStorageArea(app, req, res, next);

    case 'unloadingStorageArea':
      return unloadingStorageArea(app, req, res, next);

    case 'unloadedStorageArea':
      return unloadedStorageArea(app, req, res, next);

    default:
      return res.send(400);
  }
}

function loadedStorageArea(app, req, res, next)
{
  var storageAreaId = req.param('storageAreaId');

  app.dashboard.markAsLoaded(storageAreaId, function(err)
  {
    if (err)
    {
      if (err instanceof Error) return next(err);

      return res.send(400, err.toString());
    }

    return res.send(204);
  });
}

function unloadingStorageArea(app, req, res, next)
{
  var Forklift = app.db.model('Forklift');

  var forkliftId = req.param('forkliftId');
  var storageAreaId = req.param('storageAreaId');

  Forklift.findById(forkliftId, function(err, forklift)
  {
    if (err) return next(err);

    if (forklift === null)
    {
      return res.send(400, "Forklift does not exist: " + forkliftId);
    }

    app.dashboard.markAsUnloading(storageAreaId, forklift, function(err)
    {
      if (err)
      {
        if (err instanceof Error) return next(err);

        return res.send(400, err.toString());
      }

      return res.send(204);
    });
  });
}

function unloadedStorageArea(app, req, res, next)
{
  var storageAreaId = req.param('storageAreaId');

  app.dashboard.markAsUnloaded(storageAreaId, function(err)
  {
    if (err)
    {
      if (err instanceof Error) return next(err);

      return res.send(400, err.toString());
    }

    return res.send(204);
  });
}
