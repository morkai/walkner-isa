// TODO: Move to config file
var DEFAULT_PAGINATION_LIMIT = 15;

var Pager = require('../utils/Pager');

module.exports = function createPaginationMiddleware(defaultLimit)
{
  if (typeof defaultLimit === 'undefined')
  {
    defaultLimit = DEFAULT_PAGINATION_LIMIT;
  }

  return function paginationMiddleware(req, res, next)
  {
    var pager = new Pager({
      defaultLimit: defaultLimit,
      pageNumbers: 5,
      href: req.path,
      query: req.query
    });

    req.query.page = pager.page;
    req.query.skip = pager.skip;
    req.query.limit = pager.limit;

    res.locals.pager = pager;

    return next();
  };
};

