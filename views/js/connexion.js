$(document).ready(function () {
  $('.btn').on('click', function () {
    $.ajax({
      url: '/connexion',
      beforeSend: function (request) {
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      },
      type: 'POST',
      dataType: 'html',
      data: 'login=' + $('#login').val() + '&psswd=' + $('#password').val(),
      success: function (data) {
        $('html').html(data);
      },
      error: function (xhttp, error) {
        console.error(xhttp.readyState + ' -> ' + error);
      },
      async: false
    });
  });
});