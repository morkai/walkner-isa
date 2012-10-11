$.alert = function(type, message, timeout)
{
  var $pageAlert = $('<div class="page-alert hide"></div>');
  var $alert = $('<div class="alert fade in"></div>');

  $alert
    .removeClass('alert-error alert-info alert-success alert-block')
    .addClass('alert-' + type);

  if (message.indexOf('\n') !== -1)
  {
    $alert.addClass('alert-block');
  }

  $alert
    .html('<button type="button" class="close" data-dismiss="alert">×</button>' + message)
    .on('closed', function()
    {
      $pageAlert.remove();
    });

  $pageAlert
    .append($alert)
    .prependTo('.page-alerts')
    .fadeIn();

  if (timeout)
  {
    setTimeout(function() { $alert.alert('close'); }, timeout);
  }
};

$.quickAlert = function(type, message)
{
  var timeout = 5000;

  switch (type)
  {
    case 'error':
      timeout = 9000;
      break;

    case 'success':
      timeout = 3000;
      break;

    case 'info':
      timeout = 6000;
      break;
  }

  $.alert(type, message, timeout);
};

$.validator.setDefaults({
  errorClass: 'help-block',
  highlight: function(el)
  {
    $(el).closest('.control-group').addClass('error');
  },
  unhighlight: function(el)
  {
    $(el).closest('.control-group').removeClass('error');
  }
});

$(function()
{
  $('#hd .alert[data-timeout]').each(function setAlertTimeout()
  {
    var $alert = $(this);
    var timeout = parseInt($alert.attr('data-timeout'));

    setTimeout(function() { $alert.alert('close'); }, timeout);
  });

  $('table[data-perPage]').each(function adjustTableSpace()
  {
    var $table = $(this);
    var perPage = parseInt($table.attr('data-perPage'));

    if (isNaN(perPage) || perPage < 2)
    {
      return;
    }

    var $tbody = $table.find('tbody');
    var childCount = $tbody.children().length;

    if (childCount === perPage)
    {
      return;
    }

    var avgHeight = ($tbody.outerHeight(true) / childCount);
    var missingCount = perPage - childCount;
    var missingHeight = missingCount * avgHeight;
    var currentMarginBottom = parseInt($table.css('margin-bottom'));
    var newMarginBottom = (currentMarginBottom || 0) + missingHeight;

    $table.css('margin-bottom', newMarginBottom + 'px');
  })
});
