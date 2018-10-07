/* eslint-disable */

$(document).ready(function () {
  $('#connect').on('click', function () {
    $.ajax({
      url: '/connexion.html',
      beforeSend: function (request) {
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      },
      type: 'POST',
      dataType: 'html',
      data: 'LOGIN=' + $('#login').val() + '&PSSWD=' + $('#password').val(),
      async: false,
      success: function (data, status, res) {
        $('html').html(data);
      }
    });
  });
  $('#creer').on('click', function () {});
});