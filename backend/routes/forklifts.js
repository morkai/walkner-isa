// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

var step = require('step');
var pagination = require('../middleware/pagination')();

module.exports = function startForkliftRoutes(app, done)
{
  app.get('/forklifts', pagination, browseForklifts.bind(null, app));

  app.post('/forklifts', createForklift.bind(null, app));

  app.get('/forklifts;add', showAddForkliftForm.bind(null, app));

  app.get('/forklifts/:id;edit', showEditForkliftForm.bind(null, app));

  app.get('/forklifts/:id;delete', showDeleteForkliftForm.bind(null, app));

  app.get('/forklifts/:id;control', showForkliftController.bind(null, app));

  app.get('/forklifts/:id', viewForklift.bind(null, app));

  app.put('/forklifts/:id', updateForklift.bind(null, app));

  app.del('/forklifts/:id', deleteForklift.bind(null, app));

  return done();
};

function browseForklifts(app, req, res, next)
{
  var Forklift = app.db.model('Forklift');
  var criteria = {};
  var selector = {name: 1};
  var options = {
    sort: {name: 1},
    limit: req.query.limit,
    skip: req.query.skip
  };

  step(
    function countForkliftsStep()
    {
      Forklift.count(criteria, this);
    },
    function findForkliftsStep(err, totalCount)
    {
      var nextStep = this;

      if (err) return nextStep(err);

      Forklift.find(criteria, selector, options, function(err, forklifts)
      {
        return nextStep(err, forklifts, totalCount);
      });
    },
    function sendResponseStep(err, forklifts, totalCount)
    {
      if (err) return next(err);

      res.format({
        html: function()
        {
          res.locals.pager.fill(totalCount, forklifts);

          res.render('forklifts/browse', {
            forklifts: forklifts
          });
        },
        json: function()
        {
          res.send({
            forklifts: forklifts,
            totalCount: totalCount,
            page: req.query.page,
            limit: req.query.limit
          });
        }
      });
    }
  );
}

function showAddForkliftForm(app, req, res, next)
{
  var Forklift = app.db.model('Forklift');
  var forklift = new Forklift();

  res.format({
    html: function()
    {
      res.render('forklifts/add', {forklift: forklift});
    }
  });
}

function showEditForkliftForm(app, req, res, next)
{
  var Forklift = app.db.model('Forklift');

  Forklift.findById(req.params.id, function(err, forklift)
  {
    if (err)
    {
      return next(err);
    }

    if (forklift === null)
    {
      return res.send(404);
    }

    res.format({
      html: function()
      {
        res.render('forklifts/edit', {forklift: forklift});
      }
    });
  });
}

function showDeleteForkliftForm(app, req, res, next)
{
  var Forklift = app.db.model('Forklift');

  Forklift.findById(req.params.id, function(err, forklift)
  {
    if (err)
    {
      return next(err);
    }

    if (forklift === null)
    {
      return res.send(404);
    }

    res.format({
      html: function()
      {
        res.render('forklifts/delete', {forklift: forklift});
      }
    });
  });
}

function createForklift(app, req, res, next)
{
  var Forklift = app.db.model('Forklift');
  var forklift = new Forklift(req.body);

  forklift.save(function(err)
  {
    if (err)
    {
      return next(err);
    }

    res.format({
      html: function()
      {
        res.flash('success', 'Nowy wózek został pomyślnie dodany :)');
        res.redirect(303, '/forklifts/' + forklift.id);
      },
      json: function()
      {
        res.send(201, forklift);
      }
    });
  });
}

function viewForklift(app, req, res, next)
{
  var Forklift = app.db.model('Forklift');

  Forklift.findById(req.params.id, function(err, forklift)
  {
    if (err)
    {
      return next(err);
    }

    if (forklift === null)
    {
      return res.send(404);
    }

    res.format({
      html: function()
      {
        res.render('forklifts/view', {forklift: forklift});
      },
      json: function()
      {
        res.send(forklift);
      }
    });
  });
}

function updateForklift(app, req, res, next)
{
  var Forklift = app.db.model('Forklift');

  Forklift.findById(req.params.id, function(err, forklift)
  {
    if (err)
    {
      return next(err);
    }

    if (forklift === null)
    {
      return res.send(404);
    }

    forklift.set(req.body);
    forklift.save(function(err)
    {
      if (err)
      {
        return next(err);
      }

      res.format({
        html: function()
        {
          res.flash('success', 'Wózek został pomyślnie zmodyfikowany :)');
          res.redirect(303, '/forklifts/' + forklift.id);
        },
        json: function()
        {
          res.send(forklift);
        }
      });
    });
  });
}

function deleteForklift(app, req, res, next)
{
  var Forklift = app.db.model('Forklift');

  Forklift.findById(req.params.id, function(err, forklift)
  {
    if (err)
    {
      return next(err);
    }

    if (forklift === null)
    {
      return res.send(404);
    }

    forklift.remove(function(err)
    {
      if (err)
      {
        return next(err);
      }

      res.format({
        html: function()
        {
          res.flash('success', 'Wózek został pomyślnie usunięty :)');
          res.redirect('/forklifts');
        },
        json: function()
        {
          res.send(204);
        }
      });
    });
  });
}

function showForkliftController(app, req, res, next)
{
  var Forklift = app.db.model('Forklift');

  Forklift.findById(req.params.id, function(err, forklift)
  {
    if (err)
    {
      return next(err);
    }

    if (forklift === null)
    {
      return res.send(404);
    }

    var loadedStorageAreas = app.dashboard.getLoadedStorageAreas();
    var unloadingStorageArea = app.dashboard.getUnloadingStorageArea(forklift.id);

    res.format({
      html: function()
      {
        res.render('forklifts/control', {
          forklift: forklift,
          loadedStorageAreas: loadedStorageAreas,
          unloadingStorageArea: unloadingStorageArea
        });
      }
    });
  });
}
