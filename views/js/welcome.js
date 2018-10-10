$(document).ready(function () {
  var socket = io.connect('/');
  socket.on('user connect', function () {
    getConnected(populate_connected_list);
  })
    .on('user quit', function () {
      getConnected(populate_connected_list);
    });

  function getConnected(callback) {
    $.ajax({
      url: '/connected',
      type: 'GET',
      dataType: 'JSON',
      async: true,
      success: function (data) {
        callback(data);
      }
    });
  }

  function populate_connected_list(connected_list) {
    var chaine = '';
    for (var i = 0; i < connected_list.length; i++) {
      chaine += connected_list[i].PSEUDO + ' , ';
    }
    alert(chaine);
  }
});