// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

$(function()
{
  var $deleteStorageAreaDialog = $('#deleteStorageAreaDialog');
  var $deleteBtn = $deleteStorageAreaDialog.find('.btn-primary');

  $deleteBtn.on('click', function(e)
  {
    e.preventDefault();

    $.ajax({
      type: 'DELETE',
      dataType: 'json',
      url: '/storageAreas/' + $deleteBtn.$tableRow.attr('data-id'),
      success: function()
      {
        if ($deleteBtn.$tableRow)
        {
          $deleteBtn.$tableRow.fadeOut(function()
          {
            $deleteBtn.$tableRow.remove();
            $deleteBtn.$tableRow = null;
          });
        }

        $.quickAlert('success', 'Pole odkładcze zostało pomyślnie usunięte :)');
      },
      error: function()
      {
        $.quickAlert('error', 'Nie udało się usunąć wybranego pola odkładczego :(');
      },
      complete: function()
      {
        $deleteStorageAreaDialog.modal('hide');
      }
    });
  });

  $('#storageAreasTable').on('click', '.action-delete', function()
  {
    $deleteBtn.attr('href', this.href);
    $deleteBtn.$tableRow = $(this).closest('tr');
  });
});
