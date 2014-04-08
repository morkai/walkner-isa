// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

// TODO: Move to config file or the individual routers
var MENU_ITEMS = [
  {
    label: 'Dashboard',
    href: '/'
  },
  {
    label: 'Pola odkładcze',
    href: '/storageAreas',
    privileges: ['storageAreas.browse']
  },
  {
    label: 'Wózki',
    href: '/forklifts',
    privileges: ['forklifts.browse']
  }
];

module.exports = function createMenuMiddleware(app)
{
  return function menuMiddleware(req, res, next)
  {
    if (req.accepts('html') && req.path.lastIndexOf('.') === -1)
    {
      var menuItems = [];
      var isRoot = req.path === '/';
      var pathLength = req.path.length;

      MENU_ITEMS.forEach(function(menuItem)
      {
        menuItems.push({
          label: menuItem.label,
          href: menuItem.href,
          active: (isRoot && menuItem.href === '/')
            || menuItem.href !== '/'
            && pathLength >= menuItem.href.length
            && req.path.indexOf(menuItem.href) === 0
        });
      });

      res.locals.menuItems = menuItems;
    }

    next();
  };
};
