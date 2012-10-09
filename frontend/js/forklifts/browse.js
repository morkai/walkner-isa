$(function()
{
  var $deleteForkliftDialog = $('#deleteForkliftDialog');
  var $deleteBtn = $deleteForkliftDialog.find('.btn-primary');

  $deleteBtn.on('click', function(e)
  {
    e.preventDefault();

    $.ajax({
      type: 'DELETE',
      dataType: 'json',
      url: '/forklifts/' + $deleteBtn.$tableRow.attr('data-id'),
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

        $.quickAlert('success', 'Wózek został usunięty pomyślnie');
      },
      error: function()
      {
        $.quickAlert('error', 'Nie udało się usunąć wybranego wózka :(');
      },
      complete: function()
      {
        $deleteForkliftDialog.modal('hide');
      }
    });
  });

  $('#forkliftsTable').on('click', '.action-delete', function()
  {
    $deleteBtn.attr('href', this.href);
    $deleteBtn.$tableRow = $(this).closest('tr');
  });
});
