

module.exports = function(app, done)
{
  app.get('/', showDashboard.bind(null, app));

  return done();
};

function showDashboard(app, req, res, next)
{
  res.format({
    html: function()
    {
      res.render('app/dashboard');
    }
  });
}
