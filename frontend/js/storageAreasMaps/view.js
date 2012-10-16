$(function()
{
  var heightOffset = parseInt($('#bd').css('margin-bottom'))
    + $('#hd').outerHeight(true)
    + $('#ft').outerHeight(true);

  var $mapContainer = $('#mapContainer');
  var $mapImgContainer = $('#mapImgContainer');
  var $mapImg = $('#mapImg');
  var $landmarks = $mapImgContainer.find('.landmarks');

  var storageAreasMapId = $mapContainer.attr('data-storageAreasMapId');

  $mapImgContainer.css({
    width: $mapImg.attr('width') + 'px',
    height: $mapImg.attr('height') + 'px'
  });

  function resizeMapContainer()
  {
    $mapContainer.css('height', window.innerHeight - heightOffset);
  }

  $(window).resize(resizeMapContainer);
  resizeMapContainer();

  if ('smoothZoom' in $.fn)
  {
    $mapContainer.addClass('smoothZoom');

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
  }
  else
  {
    $mapContainer.addClass('noSmoothZoom');

    var renderLabelItemTpl = _.template($('#labelItemTpl').html());

    function adjustMarkerPosition($item)
    {
      var pos = $item.attr('data-position').split(',').map(Number);
      var w = $item.outerWidth(true);
      var h = $item.outerHeight(true);
      var top = pos[1];
      var left = pos[0];

      left -= w / 2;

      if ($item.hasClass('mark'))
      {
        top += h;
      }
      else
      {
        top -= h / 2;
      }

      $item.css({
        top: top + 'px',
        left: left + 'px'
      });
    }

    function updateMarker(markerId, data)
    {
      $.ajax({
        type: 'PUT',
        url: '/storageAreasMaps/' + storageAreasMapId + '/markers/' + markerId,
        data: data,
        error: function(res)
        {
          $.quickAlert('error', res.responseText);
        }
      });
    }

    function makeDraggable($item)
    {
      $item.draggable({
        containment: 'parent',
        distance: 5,
        scroll: true,
        scrollSensitivity: 50,
        stop: function(e, ui)
        {
          var x = ui.position.left;
          var y = ui.position.top;
          var w = $item.outerWidth(true);
          var h = $item.outerHeight(true);

          x += w / 2;

          if ($item.hasClass('mark'))
          {
            y -= h;
          }
          else
          {
            y += h / 2;
          }

          updateMarker($item.attr('data-id'), {x: x, y: y});
        }
      });
    }

    function handleRemoveItem($item)
    {
      var answer = window.confirm('R U SURE?');

      if (answer)
      {
        $item.fadeOut();

        var markerId = $item.attr('data-id');

        $.ajax({
          type: 'DELETE',
          url: '/storageAreasMaps/' + storageAreasMapId + '/markers/' + markerId,
          success: function()
          {
            $item.remove();
          },
          error: function(res)
          {
            $item.fadeIn();

            $.quickAlert('error', res.responseText);
          }
        })
      }
    }

    var $items = $landmarks.find('.item');

    $items.each(function()
    {
      var $item = $(this);

      adjustMarkerPosition($item);
      makeDraggable($item);
    });

    $mapImgContainer.on('dblclick', function(e)
    {
      var $target = $(e.target);

      if ($target.hasClass('item'))
      {
        return handleRemoveItem($target);
      }

      if (e.target !== $landmarks[0])
      {
        if ($target.hasClass('item'))
        {
          return handleRemoveItem($target);
        }

        $target = $target.closest('.item');

        if ($target.length === 1)
        {
          return handleRemoveItem($target);
        }

        return;
      }

      var x = e.offsetX;
      var y = e.offsetY;

      var label = window.prompt('Label:');

      if (label)
      {
        var $label = $(renderLabelItemTpl({
          x: x,
          y: y,
          text: label
        }));

        $landmarks.append($label);

        adjustMarkerPosition($label);

        $.ajax({
          type: 'POST',
          url: '/storageAreasMaps/' + $mapContainer.attr('data-storageAreasMapId') + '/markers',
          data: {
            type: 'text',
            value: label,
            x: x,
            y: y
          },
          success: function(marker)
          {
            $.quickAlert('success', 'Nowy znacznik został pomyślnie zapisany :)');

            $label.attr('data-id', marker._id);

            makeDraggable($label);
          },
          error: function(res)
          {
            $.quickAlert('error', res.responseText);

            $label.remove();
          }
        });
      }
    });
  }
});
