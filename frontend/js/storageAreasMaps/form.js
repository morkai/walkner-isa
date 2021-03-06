// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

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
