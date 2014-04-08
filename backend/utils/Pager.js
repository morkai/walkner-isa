// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

var qs = require('querystring');
var _ = require('underscore');

module.exports = Pager;

/**
 * @constructor
 * @param {Pager.Options=} options
 */
function Pager(options)
{
  /**
   * @readonly
   * @type {Pager.Options}
   */
  this.options = _.extend({}, Pager.Options, Pager.RenderOptions, options);
  this.options.query = _.clone(this.options.query);

  /**
   * @readonly
   * @type {Number}
   */
  this.page = this.options.page === -1
    ? parseInt(this.options.query[this.options.pageParam])
    : this.options.page;

  if (isNaN(this.page) || this.page < 1)
  {
    this.page = 1;
  }

  /**
   * @readonly
   * @type {Number}
   */
  this.limit = this.options.limit === -1
    ? parseInt(this.options.query[this.options.limitParam])
    : this.options.limit;

  if (isNaN(this.limit) || this.limit < 1)
  {
    this.limit = this.options.defaultLimit;
  }

  /**
   * @readonly
   * @type {Number}
   */
  this.skip = (this.page - 1) * this.limit;

  /**
   * @readonly
   * @type {Number}
   */
  this.pageCount = 0;

  /**
   * @readonly
   * @type {Number}
   */
  this.totalCount = 0;
}

/**
 * @type {Object}
 * @extends {Pager.RenderOptions}
 */
Pager.Options = {
  /**
   * @type {String}
   */
  pageParam: 'page',

  /**
   * @type {String}
   */
  limitParam: 'limit',

  /**
   * @type {Number}
   */
  defaultLimit: 10,

  /**
   * @type {Number}
   */
  page: -1,

  /**
   * @type {Number}
   */
  limit: -1
};

/**
 * @type {Object}
 */
Pager.RenderOptions = {
  /**
   * @type {String}
   */
  href: '/',

  /**
   * @type {Number}
   */
  pageNumbers: 3,

  /**
   * @type {Boolean}
   */
  showFirstLastLinks: true,

  /**
   * @type {Boolean}
   */
  showPrevNextLinks: true,

  /**
   * @type {Boolean}
   */
  showDots: false,

  /**
   * @type {Object}
   */
  query: {},

  /**
   * @type {Boolean}
   */
  mergeQuery: true
};

/**
 * @param {Number} totalCount
 * @param {Array} items
 */
Pager.prototype.fill = function(totalCount, items)
{
  this.totalCount = totalCount;
  this.pageCount = Math.ceil(totalCount / this.limit);
};

/**
 * @return {Boolean}
 */
Pager.prototype.isLinkToFirstPageAvailable = function()
{
  return this.page > 2;
};

/**
 * @return {Boolean}
 */
Pager.prototype.isLinkToPreviousPageAvailable = function()
{
  return this.page > 1;
};

/**
 * @return {Boolean}
 */
Pager.prototype.isLinkToNextPageAvailable = function()
{
  return this.page < this.pageCount;
};

/**
 * @return {Boolean}
 */
Pager.prototype.isLinkToLastPageAvailable = function()
{
  return this.page < (this.pageCount - 1);
};

/**
 * @param {Pager.RenderOptions=} options
 */
Pager.prototype.render = function(options)
{
  if (this.pageCount < 2)
  {
    return '';
  }

  options = this.prepareRenderOptions(options);

  var href = options.href;
  var query = options.query;

  query[options.limitParam] = this.limit;
  delete query[options.pageParam];
  query[options.pageParam] = '';

  href += '?' + qs.stringify(query, '&amp;');

  var pageNrs = (options.pageNumbers - 1) / 2;
  var firstPageNr = this.page;
  var lastPageNr = firstPageNr + pageNrs;
  var cut = true;
  var showLeftDots = false;

  if ((firstPageNr - pageNrs) < 1)
  {
    firstPageNr = 1;
  }
  else
  {
    firstPageNr -= pageNrs;
    showLeftDots = firstPageNr !== 1;
  }

  if (lastPageNr > this.pageCount)
  {
    lastPageNr = this.pageCount;
    cut = false;
  }

  if (this.page < (pageNrs + 1))
  {
    lastPageNr += (pageNrs + 1) - this.page;

    if (lastPageNr > this.pageCount)
    {
      lastPageNr = this.pageCount;
    }
  }
  else if (this.page > (this.pageCount - pageNrs))
  {
    firstPageNr -= pageNrs - (this.pageCount - this.page);

    if (firstPageNr < 1)
    {
      firstPageNr = 1;
    }
  }

  var showRightDots = cut && lastPageNr !== this.pageCount;
  
  var result = '<div class="pagination pagination-centered"><ul>';

  if (options.showFirstLastLinks)
  {
    if (this.isLinkToFirstPageAvailable())
    {
      result += '<li><a href="' + href + '1">&laquo;</a>';
    }
    else
    {
      result += '<li class="disabled"><span>&laquo;</span>';
    }
  }

  if (options.showPrevNextLinks)
  {
    if (this.isLinkToPreviousPageAvailable())
    {
      result += '<li><a href="' + href + (this.page - 1) + '">&lsaquo;</a>';
    }
    else
    {
      result += '<li class="disabled"><span>&lsaquo;</span>';
    }
  }

  if (options.showDots && showLeftDots)
  {
    result += '<li><span>...</span>';
  }

  for (var page = firstPageNr; page <= lastPageNr; ++page)
  {
    result += '<li class="' + (page === this.page ? 'active' : '') + '"><a href="' + href + page + '">' + page + '</a>';
  }

  if (options.showDots && showRightDots)
  {
    result += '<li><span>...</span>';
  }

  if (options.showPrevNextLinks)
  {
    if (this.isLinkToNextPageAvailable())
    {
      result += '<li><a href="' + href + (this.page + 1) + '">&rsaquo;</a>';
    }
    else
    {
      result += '<li class="disabled"><span>&rsaquo;</span>';
    }
  }

  if (options.showFirstLastLinks)
  {
    if (this.isLinkToLastPageAvailable())
    {
      result += '<li><a href="' + href + this.pageCount + '">&raquo;</a>';
    }
    else
    {
      result += '<li class="disabled"><span>&raquo;</span>';
    }
  }

  result += '</ul></div>';

  return result;
};

/**
 * @private
 * @param {Pager.RenderOptions} options
 * @return {Pager.RenderOptions}
 */
Pager.prototype.prepareRenderOptions = function(options)
{
  options = _.extend({}, options);

  var userQuery = options.query;

  delete options.query;

  _.defaults(options, this.options);

  if (options.mergeQuery)
  {
    options.query = _.extend(options.query, userQuery);
  }
  else
  {
    options.query = userQuery;
  }

  return options;
};
