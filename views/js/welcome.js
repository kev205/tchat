$(document).ready(function () {
  var socket = io.connect('/');
  socket.on('chat', function (data) {
    alert('salut ' + data.LOGIN + ' !');
  });
  socket.on('user quit', function (data) {
    alert(data.LOGIN + ' est parti');
  });
  $('.nav-item').on('click', function () {
    for (var i = 0; i < $('.nav-item').length; i++) {
      $('.nav-item').eq(i).attr('class', 'nav-item');
    }
    $(this).attr('class', $(this).attr('class') + ' active');
  });
  $('.navbar-brand').on('click', function () {
    socket.disconnect();
  });
});