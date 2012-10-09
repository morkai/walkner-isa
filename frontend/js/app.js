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
  $('#hd .alert[data-timeout]').each(function()
  {
    var $alert = $(this);
    var timeout = parseInt($alert.attr('data-timeout'));

    setTimeout(function() { $alert.alert('close'); }, timeout);
  });
});
