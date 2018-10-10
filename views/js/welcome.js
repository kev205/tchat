$(document).ready(function () {
  var socket = io.connect('/');
  socket.on('connected', function () {
    getConnected();
  })
    .on('chat', function (data) {
      alert('salut ' + data.LOGIN + ' !');
    })
    .on('user quit', function () {
      getConnected();
    });

  function getConnected() {
    $.ajax({
      url: '/connected',
      type: 'GET',
      dataType: 'JSON',
      async: true,
      success: function (data) {
        var chaine = '';
        for (var i = 0; i < data.length; i++) {
          chaine += data[i].PSEUDO + ' , ';
        }
        alert(chaine);
      }
    });
  }
});