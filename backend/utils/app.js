var fs = require('fs');
var path = require('path');
var step = require('step');

exports.extend = function(app)
{
  /**
   * @param {*} err
   * @return {String}
   */
  app.stackOrMessage = function(err)
  {
    if (!err)
    {
      return '';
    }

    if (!(err instanceof Error))
    {
      return err.toString();
    }

    return err.stack || err.message;
  };

  /**
   * @param {Number} time
   * @param {Function} cb
   * @return {Number}
   */
  app.timeout = function(time, cb)
  {
    return setTimeout(cb, time);
  };

  /**
   * @param {String...} partN
   * @return {String}
   */
  app.path = function(partN)
  {
    var parts = Array.prototype.slice.call(arguments);

    parts.unshift(__dirname, '..');

    return path.join.apply(null, parts);
  };

  /**
   * Serially loads files ending with `.js` from the specified directory.
   *
   * `index.js` file and files with names starting with `.` are ignored.
   *
   * @param {String} dir
   * @param {Function} done
   */
  app.loadDir = function(dir, done)
  {
    fs.readdir(dir, function(err, files)
    {
      if (err)
      {
        return done(err);
      }

      files = files.filter(function(file)
      {
        if (file[0] === '.' || file === 'index.js')
        {
          return false;
        }

        var dotPos = file.lastIndexOf('.');

        return dotPos !== -1 && file.substr(dotPos + 1, 2) === 'js';
      });

      if (files.length === 0)
      {
        return done();
      }

      app.loadFiles(dir, files, done);
    });
  };

  /**
   * Serially loads the specified files.
   *
   * @param {?String} dir
   * @param {Array.<String>} files
   * @param {Function} done
   */
  app.loadFiles = function(dir, files, done)
  {
    var fileLoaders = [];

    files.forEach(function(file)
    {
      fileLoaders.push(function(err)
      {
        var next = this;

        if (err)
        {
          return next(err);
        }

        var module = require(path.join(dir, file));

        if (typeof module !== 'function')
        {
          return next();
        }

        module(app, next);
      });
    });

    fileLoaders.push(done);

    step.apply(null, fileLoaders);
  };

  /**
   * @param {String} icon
   * @param {String} href
   * @param {String} title
   * @return {String}
   */
  app.locals.actionIcon = function(icon, href, title)
  {
    var options = {};
    options.title = title;

    return app.locals.action(icon, href, options);
  };

  /**
   * @param {String} icon
   * @param {String} href
   * @param {String} label
   * @return {String}
   */
  app.locals.actionText = function(icon, href, label)
  {
    var options = {};
    options.label = label;

    return app.locals.action(icon, href, options);
  };

  /**
   * @param {String} icon
   * @param {String} href
   * @param {Object} options
   * @return {String}
   */
  app.locals.action = function(icon, href, options)
  {
    var html = '<a class="btn ' + (options.className || '') + '" href="' + href + '"';

    if (typeof options.id === 'string')
    {
      html += ' id="' + options.id + '"';
    }

    if (typeof options.title === 'string')
    {
      html += ' title="' + options.title + '"';
    }

    html += '><i class="icon-' + icon + '"></i>';

    if (typeof options.label === 'string')
    {
      html += '<span>' + options.label + '</span>';
    }

    html += '</a>';

    return html;
  };
};
