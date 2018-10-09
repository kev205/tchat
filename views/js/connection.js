/* eslint-disable */

$(document).ready(function () {
  $('#connect').on('click', function () {
    localStorage.setItem('tel', $('#phone').val());
    $.ajax({
      url: '/connection',
      type: 'POST',
      dataType: 'html',
      data: 'TEL=' + $('#phone').val() + '&PSSWD=' + $('#password').val(),
      async: false,
      success: function (data, status, response) {
        $('body').html(data);
        if (response.getResponseHeader('sign-in') === 'failed') {
          $('.container:eq(0)').append('<br>').append($('<div class="alert alert-danger"></div>').html('<center>Connexion impossible</center>'));
          $('#phone').val(localStorage.getItem('tel'));
        }
      }
    });
    setTimeout(function () {
      $('.alert').remove();
    }, 5000);
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