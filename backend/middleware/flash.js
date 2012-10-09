

module.exports = function createFlashMiddleware(app)
{
  return function(req, res, next)
  {
    if (req.path.lastIndexOf('.') !== -1)
    {
      return next();
    }

    res.locals.flash = function()
    {
      var flash = req.session.flash;

      req.session.flash = [];

      return flash || [];
    };

    res.flash = function(type, text, time)
    {
      if (!Array.isArray(req.session.flash))
      {
        req.session.flash = [];
      }

      if (typeof time === 'undefined' && type === 'success')
      {
        time = 3000;
      }

      req.session.flash.push({
        type: type,
        text: text,
        time: time
      });
    };

    return next();
  };
};
