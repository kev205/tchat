$(document).ready(function () {
  $('.btn').on('click', function () {
    $.ajax({
      url: 'http://localhost:8080/connexion.html',
      beforeSend: function (request) {
        request.setRequestHeader('Content-Type', 'x-application/www-form-urlencoded');
      },
      type: 'POST',
      dataType: 'html',
      data: 'login=' + $('#login').val() + '&psswd=' + $('#password').val(),
      success: function(data){
      },
      error: function (xhttp, error) {
        console.log(xhttp.readyState + ' -> ' + error);
      },
      async: false
    });
  });
});