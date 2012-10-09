

module.exports = function startForkliftRoutes(app, done)
{
  app.get('/forklifts', browseForklifts.bind(null, app));

  app.post('/forklifts', createForklift.bind(null, app));

  app.get('/forklifts;add', showAddForkliftForm.bind(null, app));

  app.get('/forklifts/:id;edit', showEditForkliftForm.bind(null, app));

  app.get('/forklifts/:id;delete', showDeleteForkliftForm.bind(null, app));

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
    sort: {name: 1}
  };

  Forklift.find(criteria, selector, options, function(err, forklifts)
  {
    if (err)
    {
      return next(err);
    }

    res.format({
      html: function()
      {
        res.render('forklifts/browse', {forklifts: forklifts});
      },
      json: function()
      {
        res.send(forklifts);
      }
    });
  });
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
  res.send(500);
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
