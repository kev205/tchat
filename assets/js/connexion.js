$(document).ready(function () {
  $('.btn').on('click', function () {
    $.ajax({
      url: 'localhost:8080',
      beforeSend: function (request) {
        request.setRequestHeader('Content-Type', 'x-application/www-form-urlencoded');
      },
      type: 'POST',
      dataType: 'text/html',
      data: 'login=' + $('#login').val() + '&psswd=' + $('#password').val(),
      error: function (xhttp) {
        alert(xhttp.readyState);
      },
      async: true
    });
  });
});