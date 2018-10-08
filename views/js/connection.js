/* eslint-disable */

$(document).ready(function () {
  $('#connect').on('click', function () {
    $.ajax({
      url: '/connection',
      type: 'POST',
      dataType: 'html',
      data: 'TEL=' + $('#phone').val() + '&PSSWD=' + $('#password').val(),
      async: false,
      success: function (data) {
        $('body').html(data);
      }
    });
  });
  $('#creer').on('click', function () {
    $.ajax({
      url: '/signIn',
      type: 'GET',
      dataType: 'html',
      async: false,
      success: function (data) {
        $('body').html(data);
      }
    });
  });
});