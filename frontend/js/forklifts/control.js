$(function()
{
  var loadedStorageAreaTpl = _.template($('#loadedStorageAreaTpl').html());

  var $window = $(window);
  var $noLoadedStorageAreas = $('#noLoadedStorageAreas');
  var $loadedStorageAreas = $('#loadedStorageAreas');
  var $unloadingStorageAreaContainer = $('#unloadingStorageAreaContainer');
  var $unloadingStorageArea = $('#unloadingStorageArea');
  var $map = $('#map');

  $loadedStorageAreas.on('click', '.action-unloading', function()
  {
    var $loadedStorageArea = $(this).closest('.loadedStorageArea');
    var $unloadingActions = $loadedStorageAreas.find('.action-unloading');

    $unloadingActions.attr('disabled', true);

    $.ajax({
      type: 'POST',
      url: '/control',
      data: {
        action: 'unloadingStorageArea',
        storageAreaId: $loadedStorageArea.attr('data-storageAreaId'),
        forkliftId: $loadedStorageAreas.attr('data-forkliftId')
      },
      success: function()
      {
        window.location.reload();
      },
      error: function(res)
      {
        $.quickAlert('error', res.responseText);
      },
      complete: function()
      {
        $unloadingActions.removeAttr('disabled');
      }
    })
  });

  if (!$loadedStorageAreas.is(':empty'))
  {
    $noLoadedStorageAreas.hide();
  }

  if ($unloadingStorageAreaContainer.length === 1)
  {
    $noLoadedStorageAreas.hide();
    $loadedStorageAreas.hide();
  }

  $unloadingStorageArea.find('.action-unloaded').click(function()
  {
    var $unloadedAction = $(this);

    $unloadedAction.attr('disabled', true);

    $.ajax({
      type: 'POST',
      url: '/control',
      data: {
        action: 'unloadedStorageArea',
        storageAreaId: $unloadingStorageArea.attr('data-storageAreaId'),
        forkliftId: $unloadingStorageArea.attr('data-forkliftId')
      },
      success: function()
      {
        window.location.reload();
      },
      error: function(res)
      {
        $.quickAlert('error', res.responseText);
      },
      complete: function()
      {
        $unloadedAction.removeAttr('disabled');
      }
    })
  });

  var heightOffset = $('#hd').outerHeight(true)
    + $unloadingStorageArea.outerHeight(true)
    + parseInt($unloadingStorageArea.css('margin-top')) * 2;

  $window.resize(function()
  {
    $map.css('height', (window.innerHeight - heightOffset) + 'px');
  });
  $window.resize();

  if ('smoothZoom' in $.fn)
  {
    $map.css('overflow', 'hidden');

    var $mapImg = $map.find('img').first();

    $mapImg.smoothZoom({
      responsive: true,
      width: '100%',
      height: '100%',
      zoom_BUTTONS_SHOW: false,
      pan_BUTTONS_SHOW: false,
      pan_LIMIT_BOUNDARY: false,
      mouse_DOUBLE_CLICK: false,
      zoom_MAX: 100,
      button_ICON_IMAGE: '/vendor/jquery/smoothZoom/icons.png',
      container: 'mapImgContainer'
    });

    function focusLandmark()
    {
      var $landmark = $map.find('.landmarks').children().first();

      if ($landmark.length === 1)
      {
        var landmarkPos = $landmark.attr('data-position').split(',').map(Number);

        $mapImg.smoothZoom('focusTo', {
          x: landmarkPos[0],
          y: landmarkPos[1],
          zoom: 100
        });
      }
    }

    function resizeAndFocus()
    {
      $unloadingStorageAreaContainer.toggleClass('zoom');
      $window.resize();

      focusLandmark();
    }

    $map.on('dblclick', resizeAndFocus);

    $('.action-focus').click(resizeAndFocus);

    $map.on('touchstart', function(e)
    {
      e.preventDefault();
    });

    setTimeout(focusLandmark, 10);
  }
});
