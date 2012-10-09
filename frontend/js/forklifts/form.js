$(function()
{
  $('#addForkliftForm, #editForkliftForm').validate({
    rules: {
      name: 'required'
    }
  });
});
