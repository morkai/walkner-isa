// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

$(function()
{
  var $workingStorageAreas = $('#workingStorageAreas');

  $workingStorageAreas.on('click', '.indicator-loaded', function()
  {
    var $workingStorageArea = $(this).closest('.workingStorageArea');

    if ($workingStorageArea.attr('data-state') === 'unloaded')
    {
      $.ajax({
        type: 'POST',
        url: '/control',
        data: {
          action: 'loadedStorageArea',
          storageAreaId: $workingStorageArea.attr('data-storageAreaId')
        },
        success: function()
        {
          $workingStorageArea.attr('data-state', 'loaded');
        },
        error: function(res)
        {
          $.quickAlert('error', res.responseText);
        }
      })
    }
  });

  $workingStorageAreas.on('click', '.indicator-unloading', function()
  {

  });
});
