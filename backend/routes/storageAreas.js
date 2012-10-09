

module.exports = function startStorageAreaRoutes(app, done)
{
  app.get('/storageAreas', browseStorageAreas.bind(null, app));

  return done();
};

function browseStorageAreas(app, req, res, next)
{
  res.format({
    html: function()
    {
      res.render('storageAreas/browse.jade');
    }
  });
}
