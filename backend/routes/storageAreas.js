// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

var step = require('step');
var pagination = require('../middleware/pagination')();

module.exports = function startStorageAreaRoutes(app, done)
{
  app.get('/storageAreas', pagination, browseStorageAreas.bind(null, app));

  app.post('/storageAreas', createStorageArea.bind(null, app));

  app.get('/storageAreas;add', showAddStorageAreaForm.bind(null, app));

  app.get('/storageAreas/:id;edit', showEditStorageAreaForm.bind(null, app));

  app.get('/storageAreas/:id;delete', showDeleteStorageAreaForm.bind(null, app));

  app.get('/storageAreas/:id', viewStorageArea.bind(null, app));

  app.put('/storageAreas/:id', updateStorageArea.bind(null, app));

  app.del('/storageAreas/:id', deleteStorageArea.bind(null, app));

  return done();
};

function browseStorageAreas(app, req, res, next)
{
  var StorageArea = app.db.model('StorageArea');
  var criteria = {};
  var selector = {name: 1};
  var options = {
    sort: {name: 1},
    limit: req.query.limit,
    skip: req.query.skip
  };

  step(
    function countStorageAreasStep()
    {
      StorageArea.count(criteria, this);
    },
    function findStorageAreasStep(err, totalCount)
    {
      var nextStep = this;

      if (err) return nextStep(err);

      StorageArea.find(criteria, selector, options, function(err, storageAreas)
      {
        return nextStep(err, storageAreas, totalCount);
      });
    },
    function sendResponseStep(err, storageAreas, totalCount)
    {
      if (err) return next(err);

      res.format({
        html: function()
        {
          res.locals.pager.fill(totalCount, storageAreas);

          res.render('storageAreas/browse', {
            storageAreas: storageAreas
          });
        },
        json: function()
        {
          res.send({
            storageAreas: storageAreas,
            totalCount: totalCount,
            page: req.query.page,
            limit: req.query.limit
          });
        }
      });
    }
  );
}

function showAddStorageAreaForm(app, req, res, next)
{
  var StorageArea = app.db.model('StorageArea');
  var storageArea = new StorageArea();

  res.format({
    html: function()
    {
      res.render('storageAreas/add', {storageArea: storageArea});
    }
  });
}

function showEditStorageAreaForm(app, req, res, next)
{
  var StorageArea = app.db.model('StorageArea');

  StorageArea.findById(req.params.id, function(err, storageArea)
  {
    if (err)
    {
      return next(err);
    }

    if (storageArea === null)
    {
      return res.send(404);
    }

    res.format({
      html: function()
      {
        res.render('storageAreas/edit', {storageArea: storageArea});
      }
    });
  });
}

function showDeleteStorageAreaForm(app, req, res, next)
{
  var StorageArea = app.db.model('StorageArea');

  StorageArea.findById(req.params.id, function(err, storageArea)
  {
    if (err)
    {
      return next(err);
    }

    if (storageArea === null)
    {
      return res.send(404);
    }

    res.format({
      html: function()
      {
        res.render('storageAreas/delete', {storageArea: storageArea});
      }
    });
  });
}

function createStorageArea(app, req, res, next)
{
  var StorageArea = app.db.model('StorageArea');
  var storageArea = new StorageArea(req.body);

  storageArea.save(function(err)
  {
    if (err)
    {
      return next(err);
    }

    res.format({
      html: function()
      {
        res.flash('success', 'Nowe pole odkładcze zostało pomyślnie dodane :)');
        res.redirect(303, '/storageAreas/' + storageArea.id);
      },
      json: function()
      {
        res.send(201, storageArea);
      }
    });
  });
}

function viewStorageArea(app, req, res, next)
{
  var StorageArea = app.db.model('StorageArea');

  StorageArea.findById(req.params.id, function(err, storageArea)
  {
    if (err)
    {
      return next(err);
    }

    if (storageArea === null)
    {
      return res.send(404);
    }

    res.format({
      html: function()
      {
        res.render('storageAreas/view', {storageArea: storageArea});
      },
      json: function()
      {
        res.send(storageArea);
      }
    });
  });
}

function updateStorageArea(app, req, res, next)
{
  var StorageArea = app.db.model('StorageArea');

  StorageArea.findById(req.params.id, function(err, storageArea)
  {
    if (err)
    {
      return next(err);
    }

    if (storageArea === null)
    {
      return res.send(404);
    }

    storageArea.set(req.body);
    storageArea.save(function(err)
    {
      if (err)
      {
        return next(err);
      }

      res.format({
        html: function()
        {
          res.flash('success', 'Pole odkładcze zostało pomyślnie zmodyfikowane :)');
          res.redirect(303, '/storageAreas/' + storageArea.id);
        },
        json: function()
        {
          res.send(storageArea);
        }
      });
    });
  });
}

function deleteStorageArea(app, req, res, next)
{
  var StorageArea = app.db.model('StorageArea');

  StorageArea.findById(req.params.id, function(err, storageArea)
  {
    if (err)
    {
      return next(err);
    }

    if (storageArea === null)
    {
      return res.send(404);
    }

    storageArea.remove(function(err)
    {
      if (err)
      {
        return next(err);
      }

      res.format({
        html: function()
        {
          res.flash('success', 'Pole odkładcze zostało pomyślnie usunięte :)');
          res.redirect('/storageAreas');
        },
        json: function()
        {
          res.send(204);
        }
      });
    });
  });
}
