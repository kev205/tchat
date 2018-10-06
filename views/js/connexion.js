/* eslint-disable */

$(document).ready(function () {
  $('#connect').on('click', function () {
    $.ajax({
      url: '/connexion',
      beforeSend: function (request) {
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      },
      type: 'POST',
      dataType: 'html',
      data: 'LOGIN=' + $('#login').val() + '&PSSWD=' + $('#password').val(),
      success: function (data) {
        $('html').html(data);
      },
      async: false
    });
  });
  $('#creer').on('click', function () {});
});