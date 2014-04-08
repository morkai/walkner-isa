// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

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

