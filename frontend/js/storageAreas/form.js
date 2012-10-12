$(function()
{
  $('#addStorageAreaForm, #editStorageAreaForm').validate({
    rules: {
      name: 'required'
    }
  });
});
