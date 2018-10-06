$(document).ready(function () {
  $('.btn').on('click', function () {
    $.ajax({
      url: 'http://localhost:8080/connexion.html',
      beforeSend: function (request) {
        request.setRequestHeader('Content-Type', 'text/plain');
      },
      type: 'POST',
      dataType: 'text/html',
      data: 'login=' + $('#login').val() + '&psswd=' + $('#password').val(),
      success: function(){
        alert('yes');
      },
      error: function (xhttp, error) {
        console.log(xhttp.readyState + ' -> ' + error);
      },
      async: true
    });
  });
});