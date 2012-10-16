$(function()
{
  var accept = $('#storageAreasMap-image').attr('accept');

  $('#addStorageAreasMapForm').validate({
    rules: {
      name: 'required',
      image: {
        required: true,
        accept: accept
      }
    }
  });

  $('#editStorageAreasMapForm').validate({
    rules: {
      name: 'required',
      image: {
        accept: accept
      }
    }
  });
});
