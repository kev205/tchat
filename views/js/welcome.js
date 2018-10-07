var socket = io.connect('http://localhost:8080');
socket.emit('chat message', {
  msg: 'bonjour'
});
$(document).ready(function () {
  $('.nav-item').on('click', function () {
    for (var i = 0; i < $('.nav-item').length; i++) {
      $('.nav-item').eq(i).attr('class', 'nav-item');
    }
    $(this).attr('class', $(this).attr('class') + ' active');
  });
});