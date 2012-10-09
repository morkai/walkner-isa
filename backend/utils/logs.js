var format = require('util').format;

/**
 * @param {Object} object
 */
exports.extend = function(object)
{
  ['debug', 'info', 'warn', 'error'].forEach(function(level)
  {
    object[level] = function()
    {
      log(level, Array.prototype.slice.call(arguments));
    }
  });
};

function log(level, args)
{
  var message = level + '\t' + getDateString() + '\t' + format.apply(null, args).trim() + '\n';

  if (level === 'error')
  {
    process.stderr.write(message);
  }
  else
  {
    process.stdout.write(message);
  }
}

function getDateString()
{
  var now = new Date();
  var str = now.getUTCFullYear().toString().substr(2);

  str += '-' + pad0(now.getUTCMonth() + 1);
  str += '-' + pad0(now.getUTCDate());
  str += ' ' + pad0(now.getUTCHours());
  str += ':' + pad0(now.getUTCMinutes());
  str += ':' + pad0(now.getUTCSeconds());
  str += '.';

  var ms = now.getUTCMilliseconds();

  if (ms < 10)
  {
    str += '00';
  }
  else if (ms < 100)
  {
    str += '0';
  }

  str += ms;

  return str;
}

function pad0(str)
{
  return (str.toString().length === 1 ? '0' : '') + str;
}
