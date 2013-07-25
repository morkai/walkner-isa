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
